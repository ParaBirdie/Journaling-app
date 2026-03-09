"use client";

import { JournalEntry } from "@/types";
import { formatDate, deriveTitleFromContent } from "@/lib/storage";

interface SidebarProps {
  entries: JournalEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  entries,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: SidebarProps) {
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
          {entries.length === 0
            ? "No entries yet"
            : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
        </span>
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        {entries.length === 0 ? (
          <div className="mt-8 text-center px-4">
            <p className="text-xs text-stone-400 leading-relaxed">
              Click <span className="font-medium">+</span> to write your first entry.
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {entries.map((entry) => {
              const title = deriveTitleFromContent(entry.content);
              const preview = entry.content
                .split("\n")
                .filter((l) => l.trim())
                .slice(1)
                .join(" ")
                .replace(/#{1,6}\s/g, "")
                .replace(/[*_`~]/g, "")
                .slice(0, 80);

              const isActive = entry.id === activeId;

              return (
                <li key={entry.id} className="group relative">
                  <button
                    onClick={() => onSelect(entry.id)}
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

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded text-stone-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete entry"
                  >
                    <TrashIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

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
