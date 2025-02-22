<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen bg-background text-foreground">
    <h1 class="text-3xl font-bold mb-4">{data.feed.title}</h1>
    <p class="mb-4">{data.feed.content}</p>
    <p class="mb-4">{data.feed.createdAt}</p>
    <!-- delete feed -->
    <form method="POST" action="?/deleteFeed" use:enhance class="mb-4">
        <input type="hidden" name="feedId" value={data.feed.id} />
        <button type="submit" class="bg-primary text-primary-foreground py-2 px-4 rounded">Delete Feed</button>
    </form>

    <!-- add comments -->
    <form method="POST" action="?/createComment" use:enhance class="mb-4">
        <input type="text" name="content" placeholder="Comment" class="mb-2 p-2 rounded border border-input" />
        <button type="submit" class="bg-primary text-primary-foreground py-2 px-4 rounded">Create Comment</button>
    </form>

    <!-- show comments -->
    <ul class="list-disc pl-5">
        {#each data.feed.comments as comment}
            <li class="mb-2">{comment.content}</li>
            <p class="text-sm text-muted">{comment.createdAt}</p>

            <!-- delete comment -->
            <form method="POST" action="?/deleteComment" use:enhance class="mb-4">
                <input type="hidden" name="commentId" value={comment.id} />
                <button type="submit" class="bg-destructive text-destructive-foreground py-2 px-4 rounded">Delete Comment</button>
            </form>
        {/each}
    </ul>
</div>