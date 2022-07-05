import { writable } from 'svelte/store';
import type { NoteType } from '../types/app';

export const notes = writable<NoteType[]>([]);
