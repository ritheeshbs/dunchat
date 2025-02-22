import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { feeds, workspaces } from '$lib/server/db/schema';

export const load = (async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/login');
    }

    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, params.workspaceId)
    });

    if (!workspace) {
        return error(404, 'Workspace not found');
    }

    const allFeeds = await db.query.feeds.findMany({
        where: eq(feeds.workspaceId, workspace.id)
    });

    return {
        workspace,
        allFeeds
    };
}) satisfies PageServerLoad;