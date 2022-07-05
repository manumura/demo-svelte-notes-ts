<script>
  import { useNavigate, useLocation } from 'svelte-navigator';
  import { user } from '../stores/user.store';

  const navigate = useNavigate();
  const location = useLocation();

  console.log('current user: ', $user);

  $: if (!$user) {
    navigate('/', {
      state: { from: $location.pathname },
      replace: true,
    });
  }
</script>

{#if $user}
  <slot />
{/if}
