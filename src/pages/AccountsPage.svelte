<script lang="ts">
  import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
  import { onMount, onDestroy } from 'svelte';
  import { FatalError, RetriableError, type Account } from '../types/app';

  export let location;
  export let navigate;

  let accounts: Account[] = [];
  const abortController = new AbortController();

  const findAccounts = async () => {
    console.log('find accounts');
    const maxRetries = 10;
    let retryCount = 0;

    await fetchEventSource('http://localhost:8080/api/stream/accounts', {
      signal: abortController.signal,
      async onopen(response) {
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
        console.error('Fetch event source error: ', error);
        if (error instanceof FatalError) {
          // rethrow to stop the operation
          throw error;
        } else {
          // do nothing to automatically retry. You can also return a specific retry interval here.
          if (retryCount >= maxRetries) {
            console.error('Max retries reached: closing stream');
            throw error;
          }
          retryCount++;
          console.error('retry count: ', retryCount);
        }
      },
    });
  };

  const abort = () => {
    console.log('onDestroy');
    abortController.abort();
  };

  onMount(findAccounts);

  onDestroy(abort);
</script>

<div class="m-0 m-auto p-5 box-border">
  <h1>ACCOUNTS</h1>

  {#if accounts.length <= 0}
    <h2>NO ACCOUNTS FOUND</h2>
  {:else}
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th />
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {#each accounts as account, i}
            <tr>
              <th>{i + 1}</th>
              <td>{account.id}</td>
              <td>{account.name}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
