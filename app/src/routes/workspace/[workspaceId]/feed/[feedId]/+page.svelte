<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl font-bold">{data.feed.title}</h1>
    <p>{data.feed.content}</p>
    <p>{data.feed.createdAt}</p>

    <!-- add comments -->
    <form method="POST" action="?/createComment" use:enhance>
        <input type="text" name="content" placeholder="Comment" />
        <button type="submit">Create Comment</button>
    </form>

    <!-- show comments -->
    <ul>
        {#each data.feed.comments as comment}
            <li>{comment.content}</li>
            <p>{comment.createdAt}</p>

            <!-- delete comment -->
            <form method="POST" action="?/deleteComment" use:enhance>
                <input type="hidden" name="commentId" value={comment.id} />
                <button type="submit">Delete Comment</button>
            </form>
        {/each}
    </ul>
</div>