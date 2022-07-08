<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let isModalOpen: boolean;

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
