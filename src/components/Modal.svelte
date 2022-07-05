<script lang="ts">
  // ---------------------------------------------------------
  //  Global Imports
  // ---------------------------------------------------------

  import Fa from 'svelte-fa/src/fa.svelte';
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import { createEventDispatcher } from 'svelte';

  export let isModalOpen: boolean;

  // ---------------------------------------------------------
  //  Methods
  // ---------------------------------------------------------

  const dispatch = createEventDispatcher();
</script>

<div
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={isModalOpen}
  on:click|self={() => dispatch('closeModal')}
>
  <div class="modal-box relative">
    <button
      class="btn btn-sm btn-circle absolute right-2 top-2"
      on:click={() => dispatch('closeModal')}>✕</button
    >
    <slot name="title" />

    <slot name="body" />

    <div class="modal-action">
      <slot name="footer" />
    </div>
  </div>
</div>
