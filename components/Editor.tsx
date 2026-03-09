"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { JournalEntry } from "@/types";
import { formatDate, formatTime } from "@/lib/storage";

interface EditorProps {
  entry: JournalEntry;
  onChange: (content: string) => void;
}

type ViewMode = "write" | "preview" | "split";

export default function Editor({ entry, onChange }: EditorProps) {
  const [mode, setMode] = useState<ViewMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when entry changes and in write/split mode
  useEffect(() => {
    if ((mode === "write" || mode === "split") && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [entry.id, mode]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const wordCount = useMemo(
    () => entry.content.trim().split(/\s+/).filter(Boolean).length,
    [entry.content]
  );

  const charCount = entry.content.length;

  const formattedDate = useMemo(() => formatDate(entry.updatedAt), [entry.updatedAt]);
  const formattedTime = useMemo(() => formatTime(entry.updatedAt), [entry.updatedAt]);

  const todayTitle = useMemo(() => getTodayTitle(), []);

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
            {formattedDate} at {formattedTime}
          </span>
        </div>
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
            <textarea
              ref={textareaRef}
              value={entry.content}
              onChange={handleChange}
              placeholder={`# ${todayTitle}\n\nStart writing…`}
              className="editor-textarea flex-1 px-8 py-8"
              spellCheck
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
                    {entry.content}
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
