<script lang="ts">
  import { faStar } from '@fortawesome/free-solid-svg-icons';
  import { createEventDispatcher } from 'svelte';
  import Fa from 'svelte-fa/src/fa.svelte';
  import { formatDate } from '../lib/utils';

  // ---------------------------------------------------------
  //  Props
  // ---------------------------------------------------------
  export let id: number;
  export let title: string;
  export let content: string;
  export let date: string;
  export let isFavorite: boolean;
  export let tags: string[];

  const dispatch = createEventDispatcher();

  const trimContent = (content: string) => {
    if (content.length > 100) {
      return `${content.substring(0, 100)}...`;
    }

    return content;
  };
</script>

<div class="card w-96 bg-base-100 shadow-xl mx-2 cursor-style" on:click>
  <div class="card-body">
    <h2 class="card-title">{title}</h2>
    <p>{trimContent(content)}</p>
    <div class="card-actions">
      <div class="grid grid-cols-2 gap-2 w-full">
        <div class="col-span-2">
          {#each tags as tag (tag)}
            <div class="badge badge-ghost mr-1">{tag}</div>
          {/each}
        </div>
        <div class="col-span-1">{formatDate(date)}</div>
        <div class="col-span-1 flex justify-end items-center">
          <div
            class="cursor-style"
            on:click|stopPropagation={() => dispatch('toggleFavorite', id)}
          >
            <Fa icon={faStar} color={isFavorite ? '#ffda00' : '#afaeae'} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .cursor-style {
    cursor: var(--cursor, 'default');
  }
</style>
