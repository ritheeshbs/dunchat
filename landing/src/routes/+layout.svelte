<script lang="ts">
	import { Gradient } from '$lib/components/misc';
	import '../app.css';
</script>

<div
	class="mx-auto my-2 flex min-h-screen w-full max-w-2xl flex-col items-center justify-start p-4 font-sans antialiased gap-16"
>
	<Gradient />
	<slot />
</div>

