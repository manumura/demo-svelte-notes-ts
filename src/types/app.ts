export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  isFavorite: boolean;
  tags: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Account {
  id: number;
  name: string;
}

export class RetriableError extends Error {}
export class FatalError extends Error {}
