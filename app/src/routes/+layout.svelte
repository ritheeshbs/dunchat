<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="mx-auto w-full flex flex-col items-center justify-center min-h-screen">
	{@render children()}
</div>
