export interface NoteType {
  id: number;
  title: string;
  content: string;
  date: string;
  isFavorite: boolean;
  tags: string[];
}

export interface UserType {
  id: number;
  username: string;
  email: string;
}
