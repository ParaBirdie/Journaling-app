import { JournalEntry } from "@/types";

const STORAGE_KEY = "journal_entries";

// Maximum allowed content size per entry (200 KB)
export const MAX_CONTENT_LENGTH = 200_000;
// Maximum number of entries stored
const MAX_ENTRIES = 1_000;

function isValidISOString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

/**
 * Runtime type guard for a JournalEntry.
 * Prevents tampered or malformed localStorage data from propagating into app state.
 */
function isValidEntry(value: unknown): value is JournalEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    e.id.length > 0 &&
    e.id.length <= 128 &&
    typeof e.title === "string" &&
    e.title.length <= 500 &&
    typeof e.content === "string" &&
    e.content.length <= MAX_CONTENT_LENGTH &&
    isValidISOString(e.createdAt) &&
    isValidISOString(e.updatedAt)
  );
}

export function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate each entry and cap total count to guard against bloated storage
    return parsed.filter(isValidEntry).slice(0, MAX_ENTRIES);
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
