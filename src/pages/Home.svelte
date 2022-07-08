<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa/src/fa.svelte';
  import { useFocus,useLocation,useNavigate } from 'svelte-navigator';
  import Note from '../components/Note.svelte';
  import { notes } from '../stores/notes.store';
  import { user } from '../stores/user.store';
  import type { NoteType } from '../types/app';

  const registerFocus = useFocus();
  const navigate = useNavigate();
  const location = useLocation();

  const openEditNote = (note?: NoteType) => {
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

<main>
  <div class="note-card-container">
    <div
      class="note-card-add"
      style="cursor: {cursorStyle}"
      on:click={() => {
        openEditNote();
      }}
      use:registerFocus
    >
      <Fa icon={faPlus} color="#afaeae" size="3x" />
    </div>

    {#each $notes as note (note.id)}
      <Note
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

<style lang="scss">
  main {
    padding: 2em;
    margin: 0 auto;
    width: 100vw;
    box-sizing: border-box;
  }

  .note-card {
    &-add {
      background-color: #d6d4d4;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: none;
      border: 4px dashed #a29f9f;
      width: 144px;
      height: 189px;
      color: #a29f9f;
      margin-right: 15px;
      padding: 15px;
      border-radius: 10px;
      cursor: pointer;

      &:hover {
        background-color: #c5c5c5;
      }
    }

    &-container {
      display: flex;
    }
  }
</style>
