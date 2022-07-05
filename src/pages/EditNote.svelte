<script lang="ts">
  // ---------------------------------------------------------
  //  Global Imports
  // ---------------------------------------------------------

  import moment from 'moment';
  import { onMount } from 'svelte';
  import { useFocus, useLocation, useNavigate } from 'svelte-navigator';
  import DeleteNoteModal from '../components/DeleteNoteModal.svelte';
  import { formatDate } from '../lib/utils';
  import { notes } from '../stores/notes.store';

  // ---------------------------------------------------------
  //  Props
  // ---------------------------------------------------------
  export let id: string | undefined = undefined;

  // ---------------------------------------------------------
  //  Varaible Declarations
  // ---------------------------------------------------------

  const registerFocus = useFocus();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('note id: ', id);
  const noteId = +id; // convert to number
  const note = $notes.find((note) => note.id === noteId);
  const noteIndex = $notes.findIndex((item) => item.id === noteId);

  console.log('note: ', note);
  if (id && !note) {
    console.log('navigate away');
    navigate('/', {
      state: { from: $location.pathname },
      replace: true,
    });
  }

  let title = note?.title;
  let content = note?.content;
  let tags = note?.tags;
  let isFavorite = note?.isFavorite;
  let date = note?.date;

  let tagString = tags && tags.length ? tags.join(',') : '';

  // Simple validation
  $: canSave = Boolean(title && content);

  // ---------------------------------------------------------
  //  TextArea Resizing
  // ---------------------------------------------------------

  let contentTextarea: HTMLElement;

  const onInput = () => {
    if (contentTextarea) {
      contentTextarea.style.height = 'auto';
      contentTextarea.style.height = `${contentTextarea.scrollHeight}px`;
    }
  };

  onMount(() => {
    onInput();
  });

  // ---------------------------------------------------------
  //  Note Related Methods
  // ---------------------------------------------------------

  /**
   * Save notes in the local storage
   */
  const saveNotesToStorage = () => {
    // for reactivity purposes
    $notes = $notes;

    // save it in the local storage
    localStorage.setItem('notes', JSON.stringify($notes));
  };

  const saveNote = () => {
    if (!canSave) return;

    const newNoteId = noteId ? noteId : moment().valueOf();
    const newNote = {
      id: newNoteId,
      title,
      content,
      date: moment().format('YYYYMMDDHHmmss'),
      isFavorite,
      tags: tagString
        .replace(/\s/g, '')
        .split(',')
        .filter((item) => item),
    };

    if (noteIndex !== -1) {
      $notes[noteIndex] = newNote;
    } else {
      $notes.push(newNote);
    }

    saveNotesToStorage();

    navigate('/', {
      state: { from: $location.pathname },
      replace: true,
    });
  };

  const deleteNote = () => {
    if (noteIndex !== -1) {
      $notes.splice(noteIndex, 1);
    }

    saveNotesToStorage();

    navigate('/', {
      state: { from: $location.pathname },
      replace: true,
    });
  };

  const cancel = () => {
    navigate('/', {
      state: { from: $location.pathname },
      replace: true,
    });
  };

  let showDeleteModal = false;

  /**
   * Display the Note details modal
   *
   * @param {NoteType} note
   */
  const openDeleteModal = () => {
    if (note) {
      showDeleteModal = true;
    }
  };

  /**
   * Close the Note details modal
   *
   */
  const closeDeleteModal = () => {
    showDeleteModal = false;
  };
</script>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-6 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3
            class="text-lg font-medium leading-6 text-gray-900"
            use:registerFocus
          >
            {id ? 'Edit' : 'Create'} a Note
          </h3>
          <p class="mt-1 text-sm text-gray-600">Please input the details.</p>
        </div>
      </div>

      <div class="mt-5 md:mt-0 md:col-span-5">
        <div class="shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="note-title"
                  class="block text-sm font-medium text-gray-700">Title</label
                >
                <input
                  bind:value={title}
                  type="text"
                  name="note-title"
                  id="note-title"
                  class="input input-bordered input-primary w-full max-w-xs mt-1"
                />
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="note-tags"
                  class="block text-sm font-medium text-gray-700">Tags</label
                >
                <input
                  bind:value={tagString}
                  type="text"
                  name="note-tags"
                  id="note-tags"
                  class="input input-bordered input-primary w-full max-w-xs mt-1"
                />
              </div>

              <div class="col-span-6 sm:col-span-6">
                <label
                  for="note-content"
                  class="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <div class="mt-1">
                  <textarea
                    bind:this={contentTextarea}
                    bind:value={content}
                    on:input={onInput}
                    id="note-content"
                    name="note-content"
                    rows="3"
                    class="textarea textarea-primary textarea textarea-bordered w-full sm:text-sm mt-1"
                    placeholder="Your note content"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  Brief description for your note.
                </p>
              </div>

              {#if date}
                <div class="col-span-6 sm:col-span-6">
                  <p class="block text-sm font-medium text-gray-700">
                    Last Updated: {formatDate(date)}
                  </p>
                </div>
              {/if}

              {#if id}
                <div class="col-span-6 sm:col-span-3">
                  <button
                    class="btn btn-outline btn-accent"
                    on:click={() => openDeleteModal()}
                  >
                    Delete
                  </button>
                </div>
              {/if}
              <div
                class="col-span-6 {id
                  ? 'sm:col-span-3'
                  : 'sm:col-span-6'} text-right"
              >
                <button
                  class="btn btn-outline btn-primary {!canSave
                    ? 'btn-disabled'
                    : ''}"
                  on:click={() => saveNote()}
                >
                  Save
                </button>
                <button
                  class="btn btn-outline btn-ghost"
                  on:click={() => cancel()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<DeleteNoteModal
  {...note}
  on:delete={deleteNote}
  on:close={closeDeleteModal}
  isModalOpen={showDeleteModal}
/>
