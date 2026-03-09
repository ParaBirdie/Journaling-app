"use client";

interface EmptyStateProps {
  onNew: () => void;
}

export default function EmptyState({ onNew }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-white select-none">
      <div className="text-center max-w-xs">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-stone-100 flex items-center justify-center">
          <BookIcon />
        </div>
        <h2 className="text-base font-medium text-stone-600 mb-2">
          No entry selected
        </h2>
        <p className="text-sm text-stone-400 mb-6 leading-relaxed">
          Select an entry from the sidebar or create a new one to get started.
        </p>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          <span>New Entry</span>
        </button>
      </div>
    </div>
  );
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a8a29e"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}
