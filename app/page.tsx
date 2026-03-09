"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import EmptyState from "@/components/EmptyState";
import {
  loadEntries,
  saveEntries,
  createEntry,
} from "@/lib/storage";
import { JournalEntry } from "@/types";

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    const saved = loadEntries();
    // Sort newest first
    saved.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setEntries(saved);
    if (saved.length > 0) setActiveId(saved[0].id);
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (hydrated) saveEntries(entries);
  }, [entries, hydrated]);

  const handleNew = useCallback(() => {
    const entry = createEntry();
    setEntries((prev) => [entry, ...prev]);
    setActiveId(entry.id);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setEntries((prev) => {
        const next = prev.filter((e) => e.id !== id);
        return next;
      });
      setActiveId((prev) => {
        if (prev !== id) return prev;
        // Select the next available entry
        const remaining = entries.filter((e) => e.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    },
    [entries]
  );

  const handleChange = useCallback((content: string) => {
    const now = new Date().toISOString();
    setEntries((prev) =>
      prev.map((e) =>
        e.id === activeId ? { ...e, content, updatedAt: now } : e
      )
    );
  }, [activeId]);

  const handleTitleChange = useCallback((title: string) => {
    const now = new Date().toISOString();
    setEntries((prev) =>
      prev.map((e) =>
        e.id === activeId ? { ...e, title, updatedAt: now } : e
      )
    );
  }, [activeId]);

  const activeEntry = entries.find((e) => e.id === activeId) ?? null;

  if (!hydrated) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="w-5 h-5 rounded-full border-2 border-stone-200 border-t-stone-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-white">
      <Sidebar
        entries={entries}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      {activeEntry ? (
        <Editor entry={activeEntry} onChange={handleChange} onTitleChange={handleTitleChange} />
      ) : (
        <EmptyState onNew={handleNew} />
      )}
    </div>
  );
}
