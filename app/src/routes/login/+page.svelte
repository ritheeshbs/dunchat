<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let email = $state<string>('');
	let password = $state<string>('');
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
	<label>
		Email
		<input name="email" type="email" bind:value={email} />
	</label>
	<label>
		Password
		<input type="password" name="password" bind:value={password} />
	</label>
	<button>Login</button>
	<button formaction="?/register">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
