<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();

    let title = $state('');
    let content = $state('');
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl font-bold">Create Feed</h1>
    <form method="POST" action="?/create" class="flex flex-col gap-2" use:enhance>
        <input type="text" name="title" placeholder="Title" bind:value={title} />
        <textarea name="content" placeholder="Content" bind:value={content}></textarea>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Create Feed</button>
    </form>
</div>