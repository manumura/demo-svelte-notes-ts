<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa/src/fa.svelte';
  import { useFocus, useLocation, useNavigate } from 'svelte-navigator';
  import NoteCard from '../components/NoteCard.svelte';
  import { notes } from '../stores/notes.store';
  import { user } from '../stores/user.store';
  import type { Note } from '../types/app';

  const registerFocus = useFocus();
  const navigate = useNavigate();
  const location = useLocation();

  const openEditNote = (note?: Note) => {
    if (note) {
      navigate(`/note/${note.id}`, {
        state: { from: $location.pathname },
        replace: true,
      });
    } else {
      navigate('/note', {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  };

  const saveNotesToStorage = () => {
    // for reactivity purposes
    $notes = $notes;

    localStorage.setItem('notes', JSON.stringify($notes));
  };

  const toggleFavorite = (event: CustomEvent) => {
    const noteId: number = event.detail as number;

    const note = $notes.find((item) => item.id === noteId);

    if (note) {
      note.isFavorite = !note.isFavorite;

      saveNotesToStorage();
    }
  };

  $: cursorStyle = $user ? 'pointer' : 'not-allowed';
</script>

<main class="w-screen m-0 m-auto p-2 box-border">
  <div class="flex" on:click>
    <div
      class="card w-96 bg-base-100 shadow-xl mx-2 justify-center items-center bg-gray-300 border-4 border-dashed border-gray-500 hover:bg-gray-200"
      style="cursor: {cursorStyle}"
      on:click={() => {
        openEditNote();
      }}
      use:registerFocus
    >
      <Fa icon={faPlus} color="#696969" size="3x" />
    </div>

    {#each $notes as note (note.id)}
      <NoteCard
        {...note}
        on:click={() => {
          openEditNote(note);
        }}
        on:toggleFavorite={toggleFavorite}
        --cursor={cursorStyle}
      />
    {/each}
  </div>
</main>
