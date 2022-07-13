import { writable, type Writable } from 'svelte/store';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { FatalError, RetriableError, type Account } from '../types/app';

const findAccounts = async (store: Writable<Account[]>) => {
  console.log('find accounts in store');
  const maxRetries = 10;
  let retryCount = 0;
  let _accounts: Account[] = [];

  await fetchEventSource('http://localhost:8080/api/stream/accounts', {
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

      const account: Account = JSON.parse(message.data) as Account;
      const index = _accounts.findIndex((a) => a.id == account.id);
      if (index === -1) {
        _accounts = [..._accounts, account];
      } else {
        _accounts[index] = account;
      }
      _accounts.sort((a, b) => a.id - b.id);
      store.set(_accounts);
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

// https://svelte.dev/repl/0790689ed4a9415c801910277e41e30c?version=3.46.4
export const accountsStore = (() => {
  const store = writable<Account[]>([]);

  findAccounts(store)
    .then(() => console.log('nothing to do here'))
    .catch((error) => console.error(error));

  return store;
})();
