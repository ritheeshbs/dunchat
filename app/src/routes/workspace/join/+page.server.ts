import { workspaceInvitations, workspaceMembers } from '@/server/db/schema';
import type { PageServerLoad } from './$types';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { fail, error, type Actions } from '@sveltejs/kit';

export const load = (async ({ url, locals }) => {
    console.log('Starting join page load');
    if (!locals.user) {
        console.error('Unauthorized access attempt');
        return fail(401, { error: 'Unauthorized' });
    }

    const token = url.searchParams.get('token');
    console.log(`Token received: ${token}`);

    if (!token) {
        console.error('No token provided');
        throw error(400, 'Invalid invitation token');
    }

    console.log('Querying database for invitation');
    const invitation = await db.query.workspaceInvitations.findFirst({
        where: eq(workspaceInvitations.token, token),
        with: {
            workspace: true,
            inviter: true
        }
    });

    console.log(`Invitation found: ${JSON.stringify(invitation)}`);

    if (!invitation) {
        console.error('Invalid token');
        return fail(404, { error: 'Invalid token' });
    }

    console.log(`Invitation found: ${invitation.id}`);

    // Check if the invitation has expired
    if (invitation.expiresAt < new Date()) {
        console.error('Invitation has expired');
        return fail(404, { error: 'Invitation expired' });
    }

    // Check if the invitation has already been accepted
    if (invitation.acceptedAt) {
        console.error('Invitation already accepted');
        return fail(404, { error: 'Invitation already accepted' });
    }

    // TODO: Uncomment this when we have a way to accept invitations
    // Check if the invitation is for the user
    if (invitation.inviteeEmail !== locals.user.email) {
        console.error('Invalid invitation for user');
        return fail(404, { error: 'Invalid invitation' });
    }

    console.log('Invitation is valid and can be accepted');

    // // Accept the invitation
    // await db.update(workspaceInvitations).set({
    //     acceptedAt: new Date(),
    // }).where(eq(workspaceInvitations.token, token));

    // // Add the user to the workspace
    // await db.insert(workspaceMembers).values({
    //     workspaceId: invitation.workspaceId,
    //     userId: locals.user.id,
    //     role: invitation.role,
    // });

    console.log('Returning invitation data');
    return {
        invitation,
        user: locals.user
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    join: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const token = formData.get('token') as string;

        if (!token) {
            return fail(400, { error: 'Token is required' });
        }

        const invitation = await db.query.workspaceInvitations.findFirst({
            where: eq(workspaceInvitations.token, token),
        });

        if (!invitation) {
            return fail(404, { error: 'Invitation not found' });
        }


        // Check if the invitation has already been accepted
        if (invitation.acceptedAt) {
            return fail(404, { error: 'Invitation already accepted' });
        }

        // Check if the invitation is for the user
        if (invitation.inviteeEmail !== locals.user.email) {
            return fail(404, { error: 'Invalid invitation for user' });
        }


        // Accept the invitation
        await db.update(workspaceInvitations).set({
            acceptedAt: new Date(),
        }).where(eq(workspaceInvitations.token, token));

        // Add the user to the workspace
        await db.insert(workspaceMembers).values({
            workspaceId: invitation.workspaceId,
            userId: locals.user.id,
            role: invitation.role,
        });

        return {
            success: true,
            message: 'Invitation accepted successfully'
        };

    }

};