export interface JournalEntry {
  id: string;
  title: string;
  content: string;
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
