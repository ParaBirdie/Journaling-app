"use client";

import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { JournalEntry } from "@/types";
import { formatDate, formatTime } from "@/lib/storage";
import ShareButton from "@/components/ShareButton";
import RichTextEditor from "@/components/RichTextEditor";

interface EditorProps {
  entry: JournalEntry;
  onChange: (content: string) => void;
}

type ViewMode = "write" | "preview" | "split";

export default function Editor({ entry, onChange }: EditorProps) {
  const [mode, setMode] = useState<ViewMode>("split");

  const wordCount = entry.content
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags for word count
    .split(/\s+/)
    .filter(Boolean).length;

  const charCount = entry.content.replace(/<[^>]*>/g, "").length;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-stone-100">
        <div className="flex items-center gap-1.5">
          {(["write", "split", "preview"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-xs rounded-md font-medium capitalize transition-colors ${
                mode === m
                  ? "bg-stone-100 text-stone-700"
                  : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-stone-300 select-none hidden sm:block">
            {wordCount} {wordCount === 1 ? "word" : "words"} · {charCount} chars
          </span>
          <span className="text-xs text-stone-300 select-none hidden md:block">
            {formatDate(entry.updatedAt)} at {formatTime(entry.updatedAt)}
          </span>
          <ShareButton entry={entry} />
        </div>
      </div>

      {/* Title input */}
      <div className="px-8 pt-6 pb-2 border-b border-stone-100">
        <input
          type="text"
          value={entry.title}
          placeholder="Untitled"
          className="w-full text-2xl font-semibold text-stone-800 placeholder:text-stone-300 bg-transparent outline-none"
          readOnly
        />
      </div>

      {/* Content area */}
      <div className="flex-1 flex min-h-0">
        {/* Write pane */}
        {(mode === "write" || mode === "split") && (
          <div
            className={`flex flex-col min-h-0 ${
              mode === "split"
                ? "w-1/2 border-r border-stone-100"
                : "w-full"
            }`}
          >
            <RichTextEditor
              content={entry.content}
              onChange={onChange}
              placeholder={`# ${getTodayTitle()}\n\nStart writing…`}
            />
          </div>
        )}

        {/* Preview pane */}
        {(mode === "preview" || mode === "split") && (
          <div
            className={`overflow-y-auto ${
              mode === "split" ? "w-1/2" : "w-full"
            }`}
          >
            <div className="px-10 py-8 max-w-2xl">
              {entry.content.trim() ? (
                <div className="prose-journal">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {entry.content.replace(/<[^>]*>/g, "")} {/* Strip HTML for preview */}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-stone-300 text-sm italic select-none">
                  Nothing to preview yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTodayTitle(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
