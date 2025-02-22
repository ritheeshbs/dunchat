import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { feedLabels, workspaces } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    if (!locals.user) {
        return redirect(302, '/login');
    }

    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, params.workspaceId)
    });

    if (!workspace) {
        return redirect(302, '/workspace');
    }

    const labels = await db.query.feedLabels.findMany({
        where: eq(feedLabels.workspaceId, workspace.id),
        with: {
            author: true
        }
    });
    return { labels, workspace };
}) satisfies PageServerLoad;