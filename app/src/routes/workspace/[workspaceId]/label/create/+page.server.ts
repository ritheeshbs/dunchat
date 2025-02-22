import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { feedLabels, workspaces } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

    return { workspace };
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const label = formData.get('label') as string;
        const color = formData.get('color') as string;

        if (!label || !color) {
            return fail(400, { error: 'Label and color are required' });
        }

        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.slug, params.workspaceId)
        });

        if (!workspace) {
            return fail(404, { error: 'Workspace not found' });
        }


        const [newLabel] = await db.insert(feedLabels).values({
            label: label as string,
            color: color as string,
            workspaceId: workspace.id,
            authorId: locals.user.id as string,
        });

        if (!newLabel) {
            return fail(500, { error: 'Failed to create label' });
        }

        return redirect(302, `/workspace/${params.workspaceId}/label`);
    }
}