<script lang="ts">
  // ---------------------------------------------------------
  //  Global Imports
  // ---------------------------------------------------------
  import Modal from '../components/Modal.svelte';
  import { createEventDispatcher } from 'svelte';

  // ---------------------------------------------------------
  //  Props
  // ---------------------------------------------------------

  export let isModalOpen: boolean;
  export let id: number | undefined = undefined;
  export let title: string | undefined = undefined;

  // ---------------------------------------------------------
  //  Methods
  // ---------------------------------------------------------

  const dispatch = createEventDispatcher();
</script>

<Modal on:closeModal={() => dispatch('close')} {isModalOpen}>
  <div slot="title">
    <h3 class="text-lg font-bold">CONFIRM DELETE</h3>
  </div>
  <div slot="body" class="mt-5">
    Are you sure you want to delete this note "{title}" ?
  </div>

  <div slot="footer" class="modal-footer">
    <button
      class="btn btn-outline btn-accent"
      on:click|stopPropagation={() => dispatch('delete', id)}
    >
      Delete
    </button>
    <button
      class="btn btn-outline btn-ghost"
      on:click|stopPropagation={() => dispatch('close')}
    >
      Cancel
    </button>
  </div>
</Modal>
