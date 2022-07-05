import { writable } from 'svelte/store';
import type { UserType } from '../types/app';

export const user = writable<UserType>(null);
