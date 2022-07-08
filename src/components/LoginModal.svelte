<script lang="ts">
  import axios from 'axios';
  import { user } from '../stores/user.store';
  import Modal from './Modal.svelte';

  import moment from 'moment';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let isModalOpen: boolean;

  let isLoading = false;
  let username: string;
  let password: string;

  $: canSubmit = Boolean(username && password);
  $: isDisabled = isLoading;

  // TODO fetch + validation
  const login = async () => {
    if (!canSubmit) return;

    try {
      isLoading = true;
      // const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const response = await axios.get(
        'https://dog.ceo/api/breeds/image/random',
      );
      const data = await response.data;
      await sleep(3000);
      isLoading = false;
      console.log(data);

      $user = {
        id: moment().valueOf(),
        username,
        email: `${username}@test.com`,
      };
      // user.set({
      //   id: moment().valueOf(),
      //   username,
      //   email: username + '@test.com',
      // });

      dispatch('close');
    } catch (error) {
      isLoading = false;
      console.error(error);
    }
  };

  // TODO test
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
</script>

<!-- {#if isLoading} -->
<!-- <LoadingMask /> -->
<!-- {/if} -->

<Modal on:closeModal={() => dispatch('close')} {isModalOpen}>
  <div slot="title">
    <h3 class="text-lg font-bold">LOGIN</h3>
  </div>
  <div slot="body" class="mt-5">
    <div class="mt-2">
      <input
        bind:value={username}
        type="text"
        name="username"
        placeholder="Username"
        class="input input-bordered w-full max-w-md"
      />
    </div>
    <div class="mt-2">
      <input
        bind:value={password}
        type="password"
        name="password"
        placeholder="Password"
        class="input input-bordered w-full max-w-md"
      />
    </div>
  </div>

  <div slot="footer">
    <button
      class="btn btn-outline btn-primary {isLoading
        ? 'loading'
        : ''} {!canSubmit ? 'btn-disabled' : ''}"
      on:click|stopPropagation={login}
    >
      Submit
    </button>
    <button
      class="btn btn-outline btn-accent {isDisabled || isLoading
        ? 'btn-disabled'
        : ''}"
      on:click|stopPropagation={() => {
        if (!isDisabled) {
          dispatch('close');
        }
      }}
    >
      Cancel
    </button>
  </div>
</Modal>
