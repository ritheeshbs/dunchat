<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-4">
    <h1>Labels</h1>
    <a href="/workspace/{data.workspace.slug}/label/create">Create Label</a>
    <div class="flex flex-col gap-2">
        {#each data.labels as label}
            <div class="flex flex-col gap-2">
                <h2>{label.label}</h2>
                <p>{label.color}</p>
            </div>
        {/each}
    </div>
</div>