"use client";

import { JournalEntry, Folder } from "@/types";
import { formatDate } from "@/lib/storage";
import { useState, useCallback } from "react";

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  activeId: string | null;
  activeFolderId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
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
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onSelectFolder,
  onMoveEntry,
}: SidebarProps) {
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

// Icons
function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function FolderIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 19a2 2 0 0 1-2.414-2.80l-2.05-7.07A2 2 0 0 0 15.574 8H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h19a2 2 0 0 0 2-2z" />
      <path d="M2 10h15.574a2 2 0 0 1 1.961 1.412l1.286 4.41" />
    </svg>
  );
}

function FolderPlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 10v6M9 13h6" />
      <path d="M20 6a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z" />
    </svg>
  );
}

function FolderMoveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      <path d="M17 8l-5 5M12 13l5-5" />
      <path d="M17 3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
    </svg>
  );
}
