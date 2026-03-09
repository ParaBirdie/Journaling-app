"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import EmptyState from "@/components/EmptyState";
import {
  loadEntries,
  saveEntries,
  createEntry,
  deriveTitleFromContent,
  MAX_CONTENT_LENGTH,
  loadFolders,
  saveFolders,
  createFolder,
  deleteFolder,
  renameFolder,
} from "@/lib/storage";
import { JournalEntry, ColorCode, Folder } from "@/types";

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    const saved = loadEntries();
    // Sort newest first; guard against NaN from invalid date strings
    saved.sort((a, b) => {
      const ta = new Date(a.updatedAt).getTime();
      const tb = new Date(b.updatedAt).getTime();
      if (isNaN(ta) && isNaN(tb)) return 0;
      if (isNaN(ta)) return 1;
      if (isNaN(tb)) return -1;
      return tb - ta;
    });
    setEntries(saved);
    if (saved.length > 0) setActiveId(saved[0].id);

    const savedFolders = loadFolders();
    setFolders(savedFolders);

    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (hydrated) saveEntries(entries);
  }, [entries, hydrated]);

  useEffect(() => {
    if (hydrated) saveFolders(folders);
  }, [folders, hydrated]);

  const handleNew = useCallback(() => {
    const entry = createEntry();
    if (activeFolderId) {
      entry.folderId = activeFolderId;
    }
    setEntries((prev) => [entry, ...prev]);
    setActiveId(entry.id);
  }, [activeFolderId]);

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
    // Enforce per-entry size limit to prevent localStorage exhaustion
    if (content.length > MAX_CONTENT_LENGTH) return;
    const now = new Date().toISOString();
    setEntries((prev) =>
      prev.map((e) =>
        e.id === activeId ? { ...e, content, title: deriveTitleFromContent(content), updatedAt: now } : e
      )
    );
  }, [activeId]);

  const handleColorChange = useCallback((id: string, color: ColorCode) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              color,
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
  }, []);

  const handleCreateFolder = useCallback((folderName: string) => {
    const folder = createFolder(folderName);
    setFolders((prev) => [...prev, folder]);
  }, []);

  const handleDeleteFolder = useCallback((folderId: string) => {
    deleteFolder(folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setEntries((prev) =>
      prev.map((e) =>
        e.folderId === folderId ? { ...e, folderId: undefined } : e
      )
    );
  }, []);

  const handleRenameFolder = useCallback((folderId: string, newName: string) => {
    renameFolder(folderId, newName);
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, name: newName, updatedAt: new Date().toISOString() }
          : f
      )
    );
  }, []);

  const handleSelectFolder = useCallback((folderId: string | null) => {
    setActiveFolderId(folderId);
    // Select first entry in folder if available
    const entriesInFolder = entries.filter((e) => e.folderId === folderId);
    if (entriesInFolder.length > 0) {
      setActiveId(entriesInFolder[0].id);
    } else {
      setActiveId(null);
    }
  }, [entries]);

  const handleMoveEntry = useCallback(
    (entryId: string, targetFolderId: string | null) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId ? { ...e, folderId: targetFolderId } : e
        )
      );
    },
    []
  );

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
        folders={folders}
        activeId={activeId}
        activeFolderId={activeFolderId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        onColorChange={handleColorChange}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
        onSelectFolder={handleSelectFolder}
        onMoveEntry={handleMoveEntry}
      />
      {activeEntry ? (
        <Editor entry={activeEntry} onChange={handleChange} />
      ) : (
        <EmptyState onNew={handleNew} />
      )}
    </div>
  );
}
