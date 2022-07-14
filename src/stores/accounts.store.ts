import { writable } from 'svelte/store';
import axios from 'axios';
import type { Account } from '../types/app';

const initAccounts = async (): Promise<Account[]> => {
  console.log('find accounts in store');
  const response = await axios.get('http://localhost:8080/api/accounts', {
    // transformResponse:
  });
  console.log('response: ', response);
  if (response.statusText === 'OK') {
    const _accounts = response.data as Account[];
    console.log('accounts: ', _accounts);
    return _accounts;
  } else {
    return [];
  }
};

// https://svelte.dev/repl/0790689ed4a9415c801910277e41e30c?version=3.46.4
export const accounts = (() => {
  const store = writable<Account[]>([]);

  initAccounts()
    .then((a) => store.set(a))
    .catch((error) => console.error(error));

  return store;
})();
