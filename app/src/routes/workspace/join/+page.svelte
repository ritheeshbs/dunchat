<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl font-bold">Join Workspace</h1>
    <p>You have been invited to join a workspace.</p>
    <p>Click the button below to join the workspace.</p>
    {#if data.invitation}
        <div class="text-center">
            <p class="mb-2">Invitation ID: {data.invitation.id}</p>
            <p class="mb-2">Workspace: {data.invitation.workspace.name}</p>
            <p class="mb-2">Email: {data.invitation.inviteeEmail}</p>
            <p class="mb-2">Token: {data.invitation.token}</p>
            <p class="mb-2">Expires: {data.invitation.expiresAt}</p>
            <p class="mb-4">Inviter: {data.invitation.inviter.email}</p>
            <form method="POST" action="?/join" use:enhance>
                <input type="hidden" name="token" value={data.invitation.token} />
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md" tabindex="0">Join Workspace</button>
            </form>
        </div>
    {:else}
        <p class="text-center">No invitation found.</p>
    {/if}
</div>
