<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let label = $state('');
    let color = $state('#000000');
</script>

<div class="flex flex-col gap-4">
    <h1>Create Label</h1>
    <form method="post" action="?/create" use:enhance>
        <input type="text" name="label" bind:value={label} />
        <input type="color" name="color" bind:value={color} />
        <button type="submit">Create</button>
    </form>
</div>