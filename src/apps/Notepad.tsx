import React, { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';

const STORAGE_KEY = 'retro-os-notepad-content';

const DEFAULT_CONTENT = `TODO:
- fix dino sprite matrix
- add more radiohead tracks?
- deploy to vercel
- test on mobile

ideas:
- maybe add a calculator app?
- terminal needs 'neofetch' command
- screensaver with flying toasters?

notes:
this os is built with react + ts
games use canvas api
audio uses web audio api for noise

contact: ivanilling

random thoughts:
why did i spend 3 weeks on crt effects
the snake game is actually pretty fun
need to fix the browser iframe issue

- ivanilling`;

export default function Notepad() {
  const storedContent = useWindowStore(s => s.notepadContent);
  const setNotepadContent = useWindowStore(s => s.setNotepadContent);
  const [content, setContent] = useState(storedContent || DEFAULT_CONTENT);
  const [isSaved, setIsSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setContent(storedContent || DEFAULT_CONTENT);
  }, [storedContent]);

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
