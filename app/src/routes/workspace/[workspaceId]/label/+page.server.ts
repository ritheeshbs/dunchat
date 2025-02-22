import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { feedLabels, workspaces } from '$lib/server/db/schema';
import { redirect, fail, type Actions } from '@sveltejs/kit';

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

export const actions: Actions = {
    delete: async ({ request, params, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const labelId = formData.get('labelId') as string;

        if (!labelId) {
            return fail(400, { error: 'Label ID is required' });
        }

        const label = await db.query.feedLabels.findFirst({
            where: eq(feedLabels.id, labelId)
        });

        if (!label) {
            return fail(404, { error: 'Label not found' });
        }

        await db.delete(feedLabels).where(eq(feedLabels.id, labelId));

        return redirect(302, `/workspace/${params.workspaceId}/label`);
    }
} satisfies Actions;
