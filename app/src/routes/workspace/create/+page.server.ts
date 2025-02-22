import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { workspaceInvitations, workspaceMembers, workspaces } from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/email';
import { env } from '$env/dynamic/public';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    return {
        user: locals.user
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const userId = formData.get('userId') as string;
        const inviteeEmails = formData.getAll('inviteeEmails[]') as string[];

        if (!name || !slug || !userId) {
            return fail(400, {
                error: 'Name, slug and userId are required',
                name,
                slug
            });
        }

        try {
            // Check if slug is already taken
            const existingWorkspace = await db.query.workspaces.findFirst({
                where: eq(workspaces.slug, slug)
            });

            if (existingWorkspace) {
                return fail(400, {
                    error: 'This workspace URL is already taken. Please choose another.',
                    name,
                    slug
                });
            }

            // Use transaction to ensure data consistency
            const result = await db.transaction(async (tx) => {
                // Create workspace
                const [workspace] = await tx
                    .insert(workspaces)
                    .values({
                        name,
                        slug,
                        ownerId: userId
                    })
                    .returning();

                if (!workspace) {
                    throw new Error('Failed to create workspace');
                }

                // Add creator as admin
                await tx
                    .insert(workspaceMembers)
                    .values({
                        workspaceId: workspace.id,
                        userId,
                        role: 'admin'
                    });

                // Create invitations for all valid email addresses
                const validInvites = inviteeEmails
                    .filter(email => email && email.includes('@'))
                    .filter(email => email.toLowerCase() !== locals?.user?.email?.toLowerCase())
                    .map(email => ({
                        workspaceId: workspace.id,
                        inviterId: locals?.user?.id ?? '',
                        inviteeEmail: email,
                        role: 'member' as const,
                        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
                    }));

                if (validInvites.length > 0) {
                    const invitations = await tx
                        .insert(workspaceInvitations)
                        .values(validInvites)
                        .returning();

                    console.log('invitee emails', invitations.map(invitation => invitation.inviteeEmail));

                    // Add 3 seconds delay before sending invitation emails
                    // await new Promise(resolve => setTimeout(resolve, 3000));

                    // Send invitation emails outside of transaction
                    // Store emails to be sent after transaction commits
                    const emailPromises = invitations.map(invitation => ({
                        invite: invitation,
                        emailData: {
                            to: invitation.inviteeEmail,
                            subject: `Invitation to join ${workspace.name}`,
                            html: `
                                <h2>Workspace Invitation</h2>
                                <p>${locals.user?.email || 'Someone'} has invited you to join the workspace "${workspace.name}".</p>
                                <p>Click the link below to accept the invitation:</p>
                                <a href="${env.PUBLIC_BASE_URL}/workspace/join?token=${invitation.token}">Accept Invitation</a>
                                <p>This invitation will expire in 7 days.</p>
                            `
                        }
                    }));
                    return { workspace, emailPromises };
                }

                return { workspace, emailPromises: [] };
            });

            // Send emails after transaction commits
            if (result.emailPromises.length > 0) {
                Promise.all(
                    result.emailPromises.map(async ({ emailData }) => {
                        try {
                            await sendEmail(
                                emailData.to,
                                emailData.subject,
                                emailData.html
                            );
                        } catch (emailError) {
                            console.error('Failed to send invitation email:', emailError);
                        }
                    })
                ).catch(error => {
                    console.error('Error sending invitation emails:', error);
                });
            }

            // Instead of throwing redirect, return it
            return redirect(303, `/workspace/${result.workspace.slug}`);

        } catch (error) {
            // Only handle actual errors, not redirects
            if (error instanceof Error) {
                console.error('Failed to create workspace:', error);
                return fail(500, {
                    error: 'Failed to create workspace. Please try again.',
                    name,
                    slug
                });
            }
            throw error; // Re-throw if it's not an Error (like a Redirect)
        }
    }
};