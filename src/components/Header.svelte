<script lang="ts">
  import logo from '../assets/svelte.png';
  import { Link } from 'svelte-navigator';
  import LoginModal from './LoginModal.svelte';
  import { user } from '../stores/user.store';
  import Fa from 'svelte-fa/src/fa.svelte';
  import {
    faUser,
    faRightFromBracket,
    faR,
  } from '@fortawesome/free-solid-svg-icons';

  let showLoginModal = false;

  const openLoginModal = () => {
    showLoginModal = true;
  };

  const closeLoginModal = () => {
    showLoginModal = false;
  };

  const logout = () => {
    $user = null;
  };
</script>

<div class="navbar bg-base-100">
  <div class="flex-none">
    <div class="h-16 ml-auto">
      <img
        class="rounded-full border border-gray-100 shadow-sm h-full"
        src={logo}
        alt="Svelte Logo"
      />
    </div>
  </div>
  <div class="flex-1">
    <div class="normal-case text-xl ml-5 font-bold">Notes App</div>
    <div class="normal-case text-xl ml-5">
      <Link to="/" class="nav-link">My Notes</Link>
    </div>

    {#if $user}
      <div class="normal-case text-xl ml-5">
        <Link to="/note" class="nav-link">Create a Note</Link>
      </div>
    {/if}
  </div>
  <div class="flex-none mr-5">
    {#if !$user}
      <button
        on:click={openLoginModal}
        class="btn btn-ghost btn-xs sm:btn-sm md:btn-md lg:btn-lg gap-2"
        ><Fa icon={faUser} />
        Login</button
      >
    {:else}
      <button
        on:click={logout}
        class="btn btn-ghost btn-xs sm:btn-sm md:btn-md lg:btn-lg gap-2"
        ><Fa icon={faRightFromBracket} />
        Logout</button
      >
    {/if}
  </div>
</div>

<LoginModal on:close={closeLoginModal} isModalOpen={showLoginModal} />
