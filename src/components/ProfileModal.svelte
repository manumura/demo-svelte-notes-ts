<script lang="ts">
  import Modal from '../components/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import { user } from '../stores/user.store';

  export let isModalOpen: boolean;

  const dispatch = createEventDispatcher();
</script>

<Modal on:closeModal={() => dispatch('close')} {isModalOpen}>
  <div slot="title">
    <h3 class="text-lg font-bold">USER PROFILE</h3>
  </div>
  <div slot="body" class="mt-5">
    {#if $user}
      <div class="grid grid-cols-4 gap-x-10 gap-y-2 w-full">
        <div class="col-span-1 flex justify-end font-bold">ID</div>
        <div class="col-span-3">{$user.id}</div>
        <div class="col-span-1 flex justify-end font-bold">Username</div>
        <div class="col-span-3">{$user.username}</div>
        <div class="col-span-1 flex justify-end font-bold">Email</div>
        <div class="col-span-3">{$user.email}</div>
      </div>
    {:else}
      <div class="col-span-4">No user !!!</div>
    {/if}
  </div>

  <div slot="footer" class="flex">
    <button
      class="btn btn-outline btn-ghost mx-1"
      on:click|stopPropagation={() => dispatch('close')}
    >
      Close
    </button>
  </div>
</Modal>
