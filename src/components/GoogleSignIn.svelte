<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { user } from '../stores/user.store';

  const dispatch = createEventDispatcher();

  globalThis.handleCredentialResponse = (response: GoogleSignInResponse) => {
    const responsePayload = decodeJwtResponse(response.credential);

    // console.log('ID: ' + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log('Image URL: ' + responsePayload.picture);
    // console.log('Email: ' + responsePayload.email);

    $user = {
      id: responsePayload.sub,
      username: responsePayload.sub,
      email: responsePayload.email,
    };

    dispatch('success');
  };

  const decodeJwtResponse = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  };

  interface GoogleSignInResponse {
    clientId: string;
    credential: string;
    select_by: string;
  }
</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div
  id="g_id_onload"
  data-client_id="<CLIENT_ID>"
  data-callback="handleCredentialResponse"
  data-auto_prompt="false"
/>
<div
  class="g_id_signin"
  data-type="standard"
  data-size="large"
  data-theme="outline"
  data-text="sign_in_with"
  data-shape="rectangular"
  data-logo_alignment="left"
/>
