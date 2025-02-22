<script lang="ts">
    import { Plus, Trash2 } from "lucide-svelte";
    import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	
    let { data }: { data: PageData } = $props();
    
    let name = $state('');
    let slug = $state('');
    let invitees = $state<string[]>(['']);

    function addInviteeField() {
        invitees = [...invitees, ''];
    }

    function removeInviteeField(index: number) {
        invitees = invitees.filter((_, i) => i !== index);
    }

    function updateInvitee(index: number, value: string) {
        invitees = invitees.map((email, i) => i === index ? value : email);
    }

    // Auto-generate slug from name
    $effect(() => {
        slug = name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    });
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>

<div class="container mx-auto max-w-2xl py-8">
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-6">Create Workspace</h1>

        <form method="POST" action="?/create" class="space-y-6" use:enhance>
            <div class="space-y-2">
                <label for="name">Workspace Name</label>
                <input 
                    id="name"
                    type="text" 
                    name="name" 
                    bind:value={name}
                    placeholder="My Awesome Workspace"
                    required
                />
            </div>

            <div class="space-y-2">
                <label for="slug">Workspace URL</label>
                <input 
                    id="slug"
                    type="text" 
                    name="slug" 
                    bind:value={slug}
                    placeholder="my-awesome-workspace"
                    required
                />
            </div>

            <input type="hidden" name="userId" value={data.user.id} />

            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <label for="inviteeEmails">Invite Team Members</label>
                    <button 
                        type="button" 
                        class="bg-gray-100 p-2 rounded-md"
                        onclick={addInviteeField}
                    >
                        <Plus class="w-4 h-4 mr-2" />
                        Add Member
                    </button>
                </div>

                {#each invitees as email, index}
                    <div class="flex gap-2">
                        <label for={`inviteeEmails-${index}`}>
                            <input 
                                id={`inviteeEmails-${index}`}
                                type="email" 
                                name="inviteeEmails[]" 
                                value={email}
                                oninput={(e) => updateInvitee(index, e.currentTarget.value)}
                                placeholder="team@example.com"
                            />
                        </label>
                        {#if invitees.length > 1}
                            <button 
                                type="button"
                                class="bg-gray-100 p-2 rounded-md"
                                onclick={() => removeInviteeField(index)}
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        {/if}
                    </div>
                {/each}
            </div>

            <button type="submit" class="w-full">
                Create Workspace
            </button>
        </form>
    </div>
</div>