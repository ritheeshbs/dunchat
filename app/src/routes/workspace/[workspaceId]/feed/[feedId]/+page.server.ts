import type { PageServerLoad } from './$types';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { feedComments, feeds, workspaces } from '$lib/server/db/schema';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    if (!locals.user) {
        return redirect(302, '/login');
    }

    const feed = await db.query.feeds.findFirst({
        where: eq(feeds.id, params.feedId),
        with: {
            comments: true,
        }
    });

    if (!feed) {
        return error(404, 'Feed not found');
    }

    return {
        feed
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createComment: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const feedId = params.feedId as string;
        const workspaceId = params.workspaceId as string;
        const content = formData.get('content') as string;


        if (!content || !feedId || !workspaceId) {
            return fail(400, { error: 'Content, feedId and workspaceId are required' });
        }

        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        // get the workspace
        const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.slug, workspaceId)
        });

        if (!workspace) {
            return fail(404, { error: 'Workspace not found' });
        }

        const [comment] = await db.insert(feedComments).values({
            content,
            authorId: locals.user.id,
            workspaceId: workspace.id,
            feedId: feedId
        }).returning();

        if (!comment) {
            return fail(500, { error: 'Failed to create comment' });
        }

        return { success: true, comment };
    },
    deleteComment: async ({ params, locals, request }) => {
        const formData = await request.formData();
        const commentId = formData.get('commentId') as string;
        const feedId = params.feedId as string;

        if (!commentId || !feedId) {
            return fail(400, { error: 'Comment ID and feed ID are required' });
        }

        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        await db.delete(feedComments).where(eq(feedComments.id, commentId));

        return { success: true };
    },
    deleteFeed: async ({ locals, request, params }) => {
        const formData = await request.formData();
        const feedId = formData.get('feedId') as string;

        if (!feedId) {
            return fail(400, { error: 'Feed ID is required' });
        }

        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        await db.delete(feeds).where(eq(feeds.id, feedId));

        throw redirect(302, `/workspace/${params.workspaceId}/feed`);
    }
}
