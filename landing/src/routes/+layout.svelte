<script lang="ts">
	import { Footer, Gradient } from '$lib/components/misc';
	import { fly } from "svelte/transition";
	import '../app.css';
</script>

<div
	class="mx-auto my-2 flex min-h-screen w-full max-w-2xl flex-col items-center justify-start p-4 font-sans antialiased gap-16"
	transition:fly={{ y: 50, opacity: 0, duration: 500 }}
>
	<Gradient />
	<slot />
	
	<Footer />
</div>

