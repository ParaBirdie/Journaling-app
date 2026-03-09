"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, ColorIcon } from "@/components/Icons";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing…",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleBold = () => execCommand("bold");
  const handleItalic = () => execCommand("italic");
  const handleUnderline = () => execCommand("underline");
  const handleBulletList = () => execCommand("insertUnorderedList");
  const handleNumberedList = () => execCommand("insertOrderedList");

  const handleColorChange = (color: string) => {
    execCommand("foreColor", color);
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const colorOptions = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Formatting Toolbar */}
      {isEditorFocused && (
        <div className="flex items-center gap-1 px-4 py-2 bg-stone-50 border-b border-stone-200 flex-wrap">
          <button
            onClick={handleBold}
            className="p-2 rounded hover:bg-stone-200 transition-colors"
            title="Bold (Ctrl+B)"
          >
            <BoldIcon />
          </button>
          <button
            onClick={handleItalic}
            className="p-2 rounded hover:bg-stone-200 transition-colors"
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon />
          </button>
          <button
            onClick={handleUnderline}
            className="p-2 rounded hover:bg-stone-200 transition-colors"
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon />
          </button>

          <div className="w-px h-6 bg-stone-300 mx-1" />

          <button
            onClick={handleBulletList}
            className="p-2 rounded hover:bg-stone-200 transition-colors"
            title="Bullet list"
          >
            <ListIcon />
          </button>
          <button
            onClick={handleNumberedList}
            className="p-2 rounded hover:bg-stone-200 transition-colors"
            title="Numbered list"
          >
            <ListIcon ordered />
          </button>

          <div className="w-px h-6 bg-stone-300 mx-1" />

          {/* Color picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded hover:bg-stone-200 transition-colors flex items-center gap-1"
              title="Text color"
            >
              <ColorIcon />
              <div
                className="w-4 h-4 rounded border border-stone-400"
                style={{ backgroundColor: selectedColor }}
              />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-3 z-50 grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className="w-8 h-8 rounded border-2 hover:border-stone-400 transition-all"
                    style={{
                      backgroundColor: color.value,
                      borderColor:
                        selectedColor === color.value
                          ? "#000"
                          : "#ddd",
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        className="flex-1 px-8 py-8 overflow-y-auto focus:outline-none text-stone-800 leading-relaxed rich-text-editor"
        data-placeholder={placeholder}
      />
    </div>
  );
}
