<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl font-bold">Feed</h1>
    <ul>
        {#each data.allFeeds as feed}
            <a href={`/workspace/${data.workspace.slug}/feed/${feed.id}`}>
                <li>{feed.title}</li>
                <p>{feed.content}</p>
                <p>{feed.createdAt}</p>
            </a>
        {/each}
    </ul>


</div>
