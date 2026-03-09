import { JournalEntry, Folder } from "@/types";

const STORAGE_KEY = "journal_entries";
const FOLDERS_STORAGE_KEY = "journal_folders";

export function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

export function saveEntries(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createEntry(): JournalEntry {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function deriveTitleFromContent(content: string): string {
  const firstLine = content.split("\n")[0].trim();
  // Strip leading markdown heading markers
  return firstLine.replace(/^#{1,6}\s*/, "").slice(0, 60) || "Untitled";
}

// Folder management functions
export function loadFolders(): Folder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Folder[];
  } catch {
    return [];
  }
}

export function saveFolders(folders: Folder[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
}

export function createFolder(name: string): Folder {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
  };
}

export function deleteFolder(folderId: string): void {
  const folders = loadFolders();
  const updated = folders.filter((f) => f.id !== folderId);
  saveFolders(updated);

  // Move entries from this folder back to root
  const entries = loadEntries();
  const updated_entries = entries.map((e) =>
    e.folderId === folderId ? { ...e, folderId: undefined } : e
  );
  saveEntries(updated_entries);
}

export function renameFolder(folderId: string, newName: string): void {
  const folders = loadFolders();
  const updated = folders.map((f) =>
    f.id === folderId
      ? { ...f, name: newName, updatedAt: new Date().toISOString() }
      : f
  );
  saveFolders(updated);
}
