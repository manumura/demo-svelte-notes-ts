<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  // import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';
  import axios from 'axios';
  import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
  import { FatalError, RetriableError, type Account } from '../types/app';
  import { accounts } from '../stores/accounts.store';
  import LoadingMask from '../components/LoadingMask.svelte';

  // let accounts: Account[] = [];
  let isLoading = false;
  let counter = 0;
  const abortController = new AbortController();

  // Create a new observer instance:
  // const observer = new MutationObserver((mutations) => {
  //   console.log('observing mutation: ', mutations);

  //   for (const mutation of mutations) {
  //     console.log('mutation target: ', mutation.target);
  //     if (mutation.type === 'childList') {
  //       console.log('A child node has been added or removed.');
  //     } else if (mutation.type === 'attributes') {
  //       console.log('The ' + mutation.attributeName + ' attribute was modified.');
  //     }
  //   }
  // });

  // // Select the target to observe:
  // const target = document.querySelector('body');
  // if (target) {
  //   console.log('target: ', target);
  //   // Set configuration object:
  //   const config = { attributes: true, childList: true, subtree: true, characterData: true };
  //   // Start the observer
  //   observer.observe(target, config);
  // }

  const init = async () => {
    const _accounts = await initAccounts();
    accounts.set(_accounts);
    subscribeAccounts();
  };

  const initAccounts = async (): Promise<Account[]> => {
    console.log('find accounts');
    isLoading = true;

    try {
      // https://gist.github.com/klummy/cf739bdb3c63264d8d6427d9b6f8772d
      const response = await axios.get('http://localhost:8080/api/accounts');
      isLoading = false;
      if (response.statusText === 'OK') {
        return response.data as Account[];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error while fetching accounts: ', error);
      isLoading = false;
      return [];
    }
  };

  const subscribeAccounts = async () => {
    console.log('subscribe to accounts');
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
        // console.log('message received: ', message);
        if (message.event === 'FatalError') {
          throw new FatalError(message.data);
        }

        const account: Account = JSON.parse(message.data);
        updateAccounts(account);
        hightlightRow(account.id);
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

  const updateAccounts = (account: Account) => {
    const index = $accounts.findIndex((a) => a.id == account.id);
    if (index === -1) {
      $accounts = [...$accounts, account];
      counter++;
      console.log('counter: ', counter);
    } else {
      $accounts[index] = account;
    }
    // $accounts.sort((a, b) => a.id - b.id);
  };

  const hightlightRow = (accountId: number) => {
    const row = document.getElementById('account-' + accountId);
    if (row) {
      row.classList.add('highlight-row');
      row.onanimationend = () => {
        row.classList.remove('highlight-row');
      };
    }
  };

  const destroy = () => {
    console.log('onDestroy');
    abortController.abort();
  };

  onMount(init);

  onDestroy(destroy);
</script>

<div class="mt-4 mb-3">
  <div class="relative rounded-xl overflow-hidden flex flex-col items-center justify-center">
    <div class="flex justify-center items-center gap-x-1">
      <h1>ACCOUNTS</h1>
      {#if counter > 0}
        <span class="badge">+{counter}</span>
      {/if}
    </div>
    <div class="relative rounded-xl overflow-auto w-3/4">
      <div class="shadow-sm overflow-auto my-8">
        {#if isLoading}
          <h2>Loading...</h2>
        {:else if $accounts.length <= 0}
          <h2>NO ACCOUNTS FOUND</h2>
        {:else}
          <table class="border-collapse table-auto w-full text-sm">
            <!-- head -->
            <thead>
              <tr class="bg-gray-200 highlight">
                <th class="th-header">#</th>
                <th class="th-header">ID</th>
                <th class="th-header">NAME</th>
                <th class="th-header">CREATED BY</th>
                <th class="th-header">CREATED DATE</th>
                <th class="th-header">LAST MODIFIED BY</th>
                <th class="th-header">LAST MODIFIED DATE</th>
              </tr>
            </thead>
            <tbody>
              {#each $accounts as account, i}
                <tr id="account-{account.id}" class="odd:bg-white even:bg-gray-50">
                  <td class="td-body">{i + 1}</td>
                  <td class="td-body">{account.id}</td>
                  <td class="td-body">{account.name}</td>
                  <td class="td-body">{account.createdBy}</td>
                  <td class="td-body">{account.createdDate}</td>
                  <td class="td-body">{account.lastModifiedBy}</td>
                  <td class="td-body">{account.lastModifiedDate}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>
</div>
