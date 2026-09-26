import React, { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';

const STORAGE_KEY = 'retro-os-notepad-content';

export default function Notepad() {
  const storedContent = useWindowStore(s => s.notepadContent);
  const setNotepadContent = useWindowStore(s => s.setNotepadContent);
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Очищаем при загрузке - всегда начинаем с пустого файла
  useEffect(() => {
    setContent('');
    setNotepadContent('');
    localStorage.setItem(STORAGE_KEY, '');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsSaved(false);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setNotepadContent(newContent);
      localStorage.setItem(STORAGE_KEY, newContent);
      setIsSaved(true);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <article className="h-full w-full flex flex-col bg-white" role="main" aria-label="Notepad application">
      {/* Menu bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-2 py-1 flex items-center text-xs">
        <button className="px-2 py-0.5 hover:bg-blue-600 hover:text-white rounded" aria-label="File menu">File</button>
        <button className="px-2 py-0.5 hover:bg-blue-600 hover:text-white rounded" aria-label="Edit menu">Edit</button>
        <button className="px-2 py-0.5 hover:bg-blue-600 hover:text-white rounded" aria-label="Format menu">Format</button>
        <button className="px-2 py-0.5 hover:bg-blue-600 hover:text-white rounded" aria-label="Help menu">Help</button>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-xs ${isSaved ? 'text-green-600' : 'text-orange-500'}`}>
            {isSaved ? '✓ Saved' : '● Saving...'}
          </span>
        </div>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className="flex-1 w-full p-3 font-mono text-sm text-gray-800 bg-white resize-none outline-none leading-6"
        aria-label="Notepad text editor"
        spellCheck={false}
        placeholder="Start typing..."
      />

      {/* Status bar */}
      <div className="bg-gray-100 border-t border-gray-300 px-3 py-1 flex items-center text-xs text-gray-600">
        <span>Words: {wordCount}</span>
        <span className="mx-2">|</span>
        <span>Characters: {charCount}</span>
        <span className="mx-2">|</span>
        <span>Lines: {content.split('\n').length}</span>
        <span className="ml-auto">Auto-save enabled</span>
      </div>
    </article>
  );
}
