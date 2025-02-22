import type { PageServerLoad } from './$types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { feeds, workspaces } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, params.workspaceId)
    });

    if (!workspace) {
        throw error(404, 'Workspace not found');
    }

    return {
        workspace,
        user: locals.user
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request, locals, params }) => {
        console.log('Creating feed...');
        if (!locals.user) {
            console.log('User is not authenticated');
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const workspaceId = params.workspaceId;

        if (!title || !workspaceId) {
            console.log('Title or workspace ID is missing');
            return fail(400, {
                error: 'Title and workspace ID are required',
                title
            });
        }

        try {
            // Verify workspace exists and user has access
            const workspace = await db.query.workspaces.findFirst({
                where: eq(workspaces.slug, workspaceId)
            });

            if (!workspace) {
                console.log('Workspace not found');
                return fail(404, { error: 'Workspace not found' });
            }

            // Create the feed
            const [feed] = await db
                .insert(feeds)
                .values({
                    title: title,
                    content: content,
                    workspaceId: workspace.id,
                    authorId: locals.user.id
                })
                .returning();

            if (!feed) {
                console.log('Failed to create feed');
                throw new Error('Failed to create feed');
            }

            console.log('Feed created successfully');
            return { success: true, feed };

        } catch (error) {
            console.error('Failed to create feed:', error);
            return fail(500, {
                error: 'Failed to create feed. Please try again.',
                title,
                content
            });
        }
    }
};