"use client";

import { useState } from "react";
import { JournalEntry, ColorCode, Folder } from "@/types";
import { formatDate, COLOR_PALETTE, getColorClasses, deriveTitleFromContent } from "@/lib/storage";
import { ChevronDownIcon, TrashIcon } from "@/components/Icons";

interface EntryItemProps {
  entry: JournalEntry;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (targetFolderId: string | null) => void;
  onColorChange?: (color: ColorCode) => void;
  folders: Folder[];
  moveDropdown: string | null;
  setMoveDropdown: (id: string | null) => void;
}

export default function EntryItem({
  entry,
  isActive,
  onSelect,
  onDelete,
  onMove,
  onColorChange,
  folders,
  moveDropdown,
  setMoveDropdown,
}: EntryItemProps) {
  const [openColorPicker, setOpenColorPicker] = useState(false);

  const title = entry.title || deriveTitleFromContent(entry.content);
  const preview = entry.content
    .split("\n")
    .slice(1)
    .join(" ")
    .slice(0, 50);

  const { bg } = getColorClasses(entry.color);

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={`w-full text-left rounded-lg px-3 py-3 transition-colors border-l-4 ${
          isActive
            ? "bg-white shadow-sm border border-stone-200 text-stone-900"
            : "hover:bg-stone-100 text-stone-700"
        } ${bg}`}
        style={{
          borderLeftColor: bg.replace("bg-", "").includes("gray")
            ? "currentColor"
            : undefined,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
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
          </div>

          {/* Color picker button */}
          {onColorChange && (
            <div className="relative ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenColorPicker(!openColorPicker);
                }}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${bg}`}
                title="Change color"
              />

              {/* Color picker dropdown */}
              {openColorPicker && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg p-2 z-50 grid grid-cols-4 gap-2">
                  {COLOR_PALETTE.map((colorOption) => (
                    <button
                      key={colorOption.color}
                      onClick={(e) => {
                        e.stopPropagation();
                        onColorChange(colorOption.color);
                        setOpenColorPicker(false);
                      }}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        colorOption.color === entry.color
                          ? `border-stone-800 ring-2 ${colorOption.ring}`
                          : "border-stone-300 hover:border-stone-500"
                      } ${colorOption.bg}`}
                      title={colorOption.label}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Entry actions */}
      <div className="opacity-0 group-hover:opacity-100 flex gap-1 absolute right-2 top-2">
        {/* Move to folder dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMoveDropdown(moveDropdown === entry.id ? null : entry.id);
            }}
            className="p-1 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Move to folder"
          >
            <ChevronDownIcon />
          </button>
          {moveDropdown === entry.id && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(null);
                  setMoveDropdown(null);
                }}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-stone-100 rounded-t-lg whitespace-nowrap"
              >
                Root
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(folder.id);
                    setMoveDropdown(null);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-stone-100 whitespace-nowrap"
                >
                  {folder.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
