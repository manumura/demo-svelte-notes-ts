import { writable } from 'svelte/store';
import type { Account } from '../types/app';

export const accounts = writable<Account[]>([]);

// const initAccounts = async (): Promise<Account[]> => {
//   console.log('find accounts in store');
//   // https://gist.github.com/klummy/cf739bdb3c63264d8d6427d9b6f8772d
//   const response = await axios.get('http://localhost:8080/api/accounts');
//   if (response.statusText === 'OK') {
//     return response.data as Account[];
//   } else {
//     return [];
//   }
// };

// // https://svelte.dev/repl/0790689ed4a9415c801910277e41e30c?version=3.46.4
// export const accounts = (() => {
//   const store = writable<Account[]>([]);

//   initAccounts()
//     .then((a) => store.set(a))
//     .catch((error) => console.error(error));

//   return store;
// })();
