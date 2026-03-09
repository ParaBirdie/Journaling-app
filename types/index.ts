export type ColorCode = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "gray";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  color: ColorCode;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  folderId?: string | null; // Optional: id of the folder this entry belongs to
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
