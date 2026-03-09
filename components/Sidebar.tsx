"use client";

import { useState, useCallback } from "react";
import { JournalEntry, ColorCode, Folder } from "@/types";
import { formatDate, deriveTitleFromContent, COLOR_PALETTE, getColorClasses } from "@/lib/storage";
import EntryItem from "@/components/EntryItem";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  PencilIcon,
  FolderPlusIcon,
  TrashIcon,
} from "@/components/Icons";

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  activeId: string | null;
  activeFolderId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: ColorCode) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onSelectFolder: (id: string | null) => void;
  onMoveEntry: (entryId: string, folderId: string | null) => void;
}

export default function Sidebar({
  entries,
  folders,
  activeId,
  activeFolderId,
  onSelect,
  onNew,
  onDelete,
  onColorChange,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onSelectFolder,
  onMoveEntry,
}: SidebarProps) {
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingFolderName, setRenamingFolderName] = useState("");
  const [moveDropdown, setMoveDropdown] = useState<string | null>(null);

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  }, [newFolderName, onCreateFolder]);

  const handleRenameFolder = useCallback(
    (folderId: string) => {
      if (renamingFolderName.trim()) {
        onRenameFolder(folderId, renamingFolderName.trim());
        setRenamingFolderId(null);
        setRenamingFolderName("");
      }
    },
    [renamingFolderName, onRenameFolder]
  );

  const toggleFolderExpand = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const rootEntries = entries.filter((e) => !e.folderId);
  const totalEntries = entries.length;
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-stone-50 border-r border-stone-200">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold tracking-widest text-stone-400 uppercase select-none">
            Journal
          </h1>
        </div>
        <button
          onClick={onNew}
          className="w-7 h-7 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          title="New entry"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Entry count */}
      <div className="px-5 pb-3">
        <span className="text-xs text-stone-400 select-none">
          {totalEntries === 0
            ? "No entries yet"
            : `${totalEntries} ${totalEntries === 1 ? "entry" : "entries"}`}
        </span>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        {totalEntries === 0 ? (
          <div className="mt-8 text-center px-4">
            <p className="text-xs text-stone-400 leading-relaxed">
              Click <span className="font-medium">+</span> to write your first
              entry.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Folders section */}
            {folders.length > 0 && (
              <div className="space-y-1">
                {folders.map((folder) => {
                  const folderEntries = entries.filter(
                    (e) => e.folderId === folder.id
                  );
                  const isExpanded = expandedFolders.has(folder.id);
                  const isSelected = activeFolderId === folder.id;

                  return (
                    <div key={folder.id}>
                      <div className="group relative flex items-center">
                        <button
                          onClick={() => toggleFolderExpand(folder.id)}
                          className="px-2 py-1 text-stone-400 hover:text-stone-600"
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronDownIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </button>

                        {renamingFolderId === folder.id ? (
                          <input
                            autoFocus
                            type="text"
                            value={renamingFolderName}
                            onChange={(e) =>
                              setRenamingFolderName(e.target.value)
                            }
                            onBlur={() =>
                              handleRenameFolder(folder.id)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRenameFolder(folder.id);
                              } else if (e.key === "Escape") {
                                setRenamingFolderId(null);
                                setRenamingFolderName("");
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm bg-white border border-stone-200 rounded"
                          />
                        ) : (
                          <button
                            onClick={() => onSelectFolder(folder.id)}
                            className={`flex-1 text-left px-2 py-1 rounded text-sm transition-colors ${
                              isSelected
                                ? "bg-white shadow-sm border border-stone-200 text-stone-900 font-medium"
                                : "hover:bg-stone-100 text-stone-700"
                            }`}
                          >
                            <FolderIcon className="inline mr-2 w-4 h-4" />
                            {folder.name} ({folderEntries.length})
                          </button>
                        )}

                        {/* Folder actions */}
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenamingFolderId(folder.id);
                              setRenamingFolderName(folder.name);
                            }}
                            className="p-1 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
                            title="Rename"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFolder(folder.id);
                            }}
                            className="p-1 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>

                      {/* Folder entries */}
                      {isExpanded && (
                        <div className="ml-6 space-y-1">
                          {folderEntries.length === 0 ? (
                            <p className="text-xs text-stone-300 px-3 py-2 italic">
                              No entries in this folder
                            </p>
                          ) : (
                            folderEntries
                              .sort(
                                (a, b) =>
                                  new Date(b.updatedAt).getTime() -
                                  new Date(a.updatedAt).getTime()
                              )
                              .map((entry) => (
                                <EntryItem
                                  key={entry.id}
                                  entry={entry}
                                  isActive={entry.id === activeId}
                                  onSelect={() => onSelect(entry.id)}
                                  onDelete={() => onDelete(entry.id)}
                                  onMove={(targetFolderId) =>
                                    onMoveEntry(entry.id, targetFolderId)
                                  }
                                  onColorChange={(color) =>
                                    onColorChange(entry.id, color)
                                  }
                                  folders={folders}
                                  moveDropdown={moveDropdown}
                                  setMoveDropdown={setMoveDropdown}
                                />
                              ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Root entries section */}
            {rootEntries.length > 0 && (
              <div className="pt-2 border-t border-stone-200">
                <div className="text-xs text-stone-400 px-3 py-2 font-medium">
                  Other
                </div>
                <div className="space-y-1">
                  {rootEntries
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .map((entry) => (
                      <EntryItem
                        key={entry.id}
                        entry={entry}
                        isActive={entry.id === activeId}
                        onSelect={() => onSelect(entry.id)}
                        onDelete={() => onDelete(entry.id)}
                        onMove={(targetFolderId) =>
                          onMoveEntry(entry.id, targetFolderId)
                        }
                        onColorChange={(color) =>
                          onColorChange(entry.id, color)
                        }
                        folders={folders}
                        moveDropdown={moveDropdown}
                        setMoveDropdown={setMoveDropdown}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New folder input */}
      <div className="px-3 pb-4 border-t border-stone-200">
        {showNewFolderInput ? (
          <div className="flex gap-2 mt-3">
            <input
              autoFocus
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => {
                setShowNewFolderInput(false);
                setNewFolderName("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFolder();
                } else if (e.key === "Escape") {
                  setShowNewFolderInput(false);
                  setNewFolderName("");
                }
              }}
              className="flex-1 px-2 py-1 text-xs border border-stone-200 rounded"
            />
            <button
              onClick={handleCreateFolder}
              className="px-2 py-1 text-xs bg-stone-200 text-stone-700 rounded hover:bg-stone-300 transition-colors"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="w-full mt-3 px-3 py-2 text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors flex items-center justify-center gap-2"
          >
            <FolderPlusIcon />
            New Folder
          </button>
        )}
      </div>
    </aside>
  );
}

interface EntryItemProps {
  entry: JournalEntry;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (folderId: string | null) => void;
  folders: Folder[];
  moveDropdown: string | null;
  setMoveDropdown: (id: string | null) => void;
}

function EntryItem({
  entry,
  isActive,
  onSelect,
  onDelete,
  onMove,
  folders,
  moveDropdown,
  setMoveDropdown,
}: EntryItemProps) {
  const title = entry.title || "Untitled";
  const preview = entry.content
    .split("\n")
    .filter((l) => l.trim())
    .join(" ")
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_`~]/g, "")
    .slice(0, 80);

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={`w-full text-left rounded-lg px-3 py-3 transition-colors ${
          isActive
            ? "bg-white shadow-sm border border-stone-200 text-stone-900"
            : "hover:bg-stone-100 text-stone-700"
        }`}
      >
        <p
          className={`text-sm font-medium truncate ${
            isActive ? "text-stone-900" : "text-stone-700"
          }`}
        >
          {title}
        </p>
        {preview && (
          <p className="text-xs text-stone-400 mt-0.5 truncate leading-relaxed">
            {preview}
          </p>
        )}
        <p className="text-xs text-stone-300 mt-1">
          {formatDate(entry.updatedAt)}
        </p>
      </button>

      {/* Entry actions */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMoveDropdown(moveDropdown === entry.id ? null : entry.id);
            }}
            className="p-1.5 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Move to folder"
          >
            <FolderMoveIcon />
          </button>

          {/* Move dropdown */}
          {moveDropdown === entry.id && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-stone-200 z-10">
              <button
                onClick={() => {
                  onMove(null);
                  setMoveDropdown(null);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-100 transition-colors ${
                  !entry.folderId ? "bg-stone-50 font-medium" : ""
                }`}
              >
                Other
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => {
                    onMove(folder.id);
                    setMoveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-100 transition-colors ${
                    entry.folderId === folder.id ? "bg-stone-50 font-medium" : ""
                  }`}
                >
                  {folder.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded transition-colors"
          title="Delete entry"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

