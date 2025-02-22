import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { workspaceInvitations, workspaceMembers, workspaces } from '$lib/server/db/schema';

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

        // Create workspace
        const [workspace] = await db.insert(workspaces).values({
            name,
            slug,
            ownerId: userId
        }).returning();

        if (!workspace) {
            return fail(500, { error: 'Failed to create workspace' });
        }

        // Add creator as admin
        await db.insert(workspaceMembers).values({
            workspaceId: workspace.id,
            userId,
            role: 'admin'
        });

        // Create invitations for all valid email addresses
        const validInvites = inviteeEmails
            .filter(email => email && email.includes('@'))
            // Don't send invitation to the workspace creator
            .filter(email => email.toLowerCase() !== locals.user.email.toLowerCase())
            .map(email => ({
                workspaceId: workspace.id,
                inviterId: locals.user.id,
                inviteeEmail: email,
                role: 'member',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
            }));

        if (validInvites.length > 0) {
            await db.insert(workspaceInvitations).values(validInvites);
        }

        throw redirect(303, `/workspace/${workspace.slug}`);
    }
};