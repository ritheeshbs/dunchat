<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { AtSignIcon, LockIcon } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';

	let { form }: { form: ActionData } = $props();
	let email = $state<string>('');
	let password = $state<string>('');

	let currentPage = $state<'login' | 'register'>('login');
</script>

<h1>{currentPage}</h1>
<form method="post" action="?/login" use:enhance>
	<label>
		Email
		<div class="flex items-center gap-2 p-3 border rounded-md bg-gray-100">
		<AtSignIcon />
		<input name="email" type="email" bind:value={email} />
		</div>
	</label>
	<label>
		Password
		<div class="flex items-center gap-2 p-3 border rounded-md bg-gray-100">
		<LockIcon />
		<input type="password" name="password" bind:value={password} />
		</div>
	</label>
	<Button type="submit">Login</Button>
	<Button formaction="?/register">Register</Button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
