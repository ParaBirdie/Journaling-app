"use client";

import { useState, useRef, useEffect } from "react";
import { JournalEntry } from "@/types";

interface ShareButtonProps {
  entry: JournalEntry;
}

export default function ShareButton({ entry }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const snippet = entry.content.slice(0, 280).trim();
  const title = entry.title || "My Journal Entry";

  async function copyToClipboard() {
    await navigator.clipboard.writeText(entry.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareToTwitter() {
    const text = encodeURIComponent(`${title}\n\n${snippet}${entry.content.length > 280 ? "…" : ""}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  function shareToLinkedIn() {
    const text = encodeURIComponent(`${title}\n\n${snippet}${entry.content.length > 280 ? "…" : ""}`);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: entry.content });
      } catch {
        // user cancelled
      }
      setOpen(false);
    }
  }

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Share entry"
        className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-medium transition-colors ${
          open
            ? "bg-stone-100 text-stone-700"
            : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
        }`}
      >
        <ShareIcon />
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-stone-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            {copied ? <CheckIcon /> : <ClipboardIcon />}
            {copied ? "Copied!" : "Copy text"}
          </button>

          <button
            onClick={shareToTwitter}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <XIcon />
            Share on X
          </button>

          <button
            onClick={shareToLinkedIn}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <LinkedInIcon />
            Share on LinkedIn
          </button>

          {hasNativeShare && (
            <button
              onClick={nativeShare}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors border-t border-stone-100"
            >
              <MoreShareIcon />
              More options…
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MoreShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
