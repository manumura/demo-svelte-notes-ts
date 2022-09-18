<script lang="ts">
  import { faRightFromBracket, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa/src/fa.svelte';
  import { Link } from 'svelte-navigator';
  import logo from '../assets/svelte.svg';
  import { user } from '../stores/user.store';
  import LoginModal from './LoginModal.svelte';
  import ProfileModal from './ProfileModal.svelte';

  let showLoginModal = false;
  let showProfileModal = false;

  const openLoginModal = () => {
    showLoginModal = true;
  };

  const closeLoginModal = () => {
    showLoginModal = false;
  };

  const openProfileModal = () => {
    showProfileModal = true;
  };

  const closeProfileModal = () => {
    showProfileModal = false;
  };

  const logout = () => {
    $user = undefined;
  };
</script>

<div class="navbar bg-base-100">
  <div class="flex-none">
    <div class="h-16 ml-auto">
      <img class="rounded-full border border-gray-100 shadow-sm h-full" src={logo} alt="Svelte Logo" />
    </div>
  </div>
  <div class="flex-1">
    <div class="normal-case text-xl ml-5 font-bold">Notes App</div>
    <div class="normal-case text-xl ml-5">
      <Link to="/">My Notes</Link>
    </div>

    {#if $user}
      <div class="normal-case text-xl ml-5">
        <Link to="/note">Create a Note</Link>
      </div>
    {/if}

    <Link to="/accounts">
      <button class="btn btn-ghost btn-xs sm:btn-sm md:btn-md lg:btn-lg ml-5"> Accounts</button>
    </Link>
  </div>
  <div class="flex-none mr-5">
    {#if !$user}
      <button on:click={openLoginModal} class="btn btn-ghost btn-xs sm:btn-sm md:btn-md lg:btn-lg gap-2"
        ><Fa icon={faSignInAlt} />
        Login</button
      >
    {:else}
      <button on:click={openProfileModal} class="btn btn-ghost btn-xs sm:btn-sm md:btn-md lg:btn-lg gap-2"
        ><Fa icon={faUser} />
        Profile</button
      >
      <button on:click={logout} class="btn btn-ghost btn-xs sm:btn-sm md:btn-md lg:btn-lg gap-2"
        ><Fa icon={faRightFromBracket} />
        Logout</button
      >
    {/if}
  </div>
</div>

<LoginModal on:close={closeLoginModal} isModalOpen={showLoginModal} />

<ProfileModal on:close={closeProfileModal} isModalOpen={showProfileModal} />
