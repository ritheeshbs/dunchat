import type { PageServerLoad } from './$types';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { feedComments, feeds } from '$lib/server/db/schema';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    if (!locals.user) {
        return redirect(302, '/login');
    }

    const feed = await db.query.feeds.findFirst({
        where: eq(feeds.id, params.feedId),
        with: {
            comments: true
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
        const content = formData.get('content') as string;

        if (!content || !feedId) {
            return fail(400, { error: 'Content and feedId are required' });
        }

        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const [comment] = await db.insert(feedComments).values({
            content,
            authorId: locals.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
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
    }
}
