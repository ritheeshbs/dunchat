<script lang="ts">
    let { children } = $props();
</script>

<div class="flex flex-col max-w-xl h-screen">
    {@render children()}
</div>