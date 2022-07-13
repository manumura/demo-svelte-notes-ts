import { writable } from 'svelte/store';
import type { Note } from '../types/app';

export const notes = writable<Note[]>([]);
