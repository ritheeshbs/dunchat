<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl font-bold">Feed</h1>
    <ul>
        {#each data.allFeeds as feed}
            <li>{feed.title}</li>
            <p>{feed.content}</p>
            <p>{feed.createdAt}</p>
        {/each}
    </ul>
</div>
