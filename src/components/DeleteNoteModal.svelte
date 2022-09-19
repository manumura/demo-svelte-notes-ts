<script lang="ts">
  import Modal from '../components/Modal.svelte';
  import { createEventDispatcher } from 'svelte';

  export let isModalOpen: boolean;
  export let id: number | undefined = undefined;
  export let title: string | undefined = undefined;

  const dispatch = createEventDispatcher();
</script>

<Modal on:closeModal={() => dispatch('close')} {isModalOpen}>
  <div slot="title">
    <h3 class="text-lg font-bold">CONFIRM DELETE</h3>
  </div>
  <div slot="body" class="mt-5">
    Are you sure you want to delete this note "{title}" ?
  </div>

  <div slot="footer" class="flex">
    <button
      id="btn-delete"
      class="btn btn-outline btn-accent mx-1"
      on:click|stopPropagation={() => dispatch('delete', { id })}
    >
      Delete
    </button>
    <button id="btn-cancel" class="btn btn-outline btn-ghost mx-1" on:click|stopPropagation={() => dispatch('close')}>
      Cancel
    </button>
  </div>
</Modal>
