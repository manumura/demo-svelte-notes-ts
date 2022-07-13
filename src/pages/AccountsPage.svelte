<script lang="ts">
  import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
  import { onMount } from 'svelte';
  import { FatalError, RetriableError, type Account } from '../types/app';

  let isLoading = false;
  let accounts: Account[] = [];

  const findAccounts = async () => {
    await fetchEventSource('http://localhost:8080/api/stream/accounts', {
      async onopen(response) {
        console.log('on open response: ', response);
        console.log(response.headers.get('content-type'));
        if (response.ok && response.headers.get('content-type')?.startsWith(EventStreamContentType)) {
          // everything's good
          return;
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // client-side errors are usually non-retriable:
          console.error('Fatal error on open');
          throw new FatalError();
        } else {
          console.error('Retriable error on open');
          throw new RetriableError();
        }
      },
      onmessage(message) {
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:
        if (message.event === 'FatalError') {
          throw new FatalError(message.data);
        }

        console.log(message.data);
        const account: Account = JSON.parse(message.data);
        const index = accounts.findIndex((a) => a.id == account.id);
        if (index === -1) {
          accounts = [...accounts, account];
        } else {
          accounts[index] = account;
        }
        accounts.sort((a, b) => a.id - b.id);
      },
      onclose() {
        // if the server closes the connection unexpectedly, retry:
        throw new RetriableError();
      },
      onerror(error) {
        console.error(error);
        if (error instanceof FatalError) {
          // rethrow to stop the operation
          throw error;
        } else {
          // do nothing to automatically retry. You can also return a specific retry interval here.
        }
      },
    });
  };

  onMount(findAccounts);
</script>

<h1>ACCOUNTS</h1>
{#if isLoading}
  <h1>LOADING</h1>
{:else}
  <ul>
    {#each accounts as account, i}
      <li>{account.id} {account.name}</li>
    {/each}
  </ul>
{/if}
