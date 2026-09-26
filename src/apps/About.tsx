import React from 'react';

export default function About() {
  return (
    <article className="h-full w-full bg-white p-6 overflow-y-auto" role="main" aria-label="About this portfolio">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🖥️</div>
          <h2 className="text-xl font-bold text-gray-800">Retro OS Portfolio</h2>
          <p className="text-sm text-gray-500 mt-1">Version 1.0</p>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <p>
            This portfolio is designed as a retro operating system experience,
            combining the nostalgic aesthetics of Windows 95 and Mac OS 8 with
            modern web technologies and accessibility standards.
          </p>

          <div className="border-2 border-gray-300 p-3" style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff' }}>
            <h3 className="font-bold mb-2">🛠️ Built With:</h3>
            <ul className="space-y-1 text-xs">
              <li>• React 18 + TypeScript (Strict Mode)</li>
              <li>• Tailwind CSS v4</li>
              <li>• Zustand (State Management)</li>
              <li>• Framer Motion (Animations)</li>
              <li>• Web Audio API (Sound Effects)</li>
              <li>• Vite (Build Tool)</li>
            </ul>
          </div>

          <div className="border-2 border-gray-300 p-3" style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff' }}>
            <h3 className="font-bold mb-2">✨ Features:</h3>
            <ul className="space-y-1 text-xs">
              <li>• Draggable & resizable windows</li>
              <li>• Z-index management (click to focus)</li>
              <li>• Window minimize/maximize/close</li>
              <li>• Desktop icons with drag positioning</li>
              <li>• Taskbar with start menu</li>
              <li>• CRT scanline effect (toggleable)</li>
              <li>• Performance mode for low-end devices</li>
              <li>• UI sound effects (toggleable)</li>
              <li>• Full localStorage persistence</li>
              <li>• Keyboard navigation support</li>
              <li>• Screen reader friendly (ARIA labels)</li>
              <li>• SEO-optimized content</li>
            </ul>
          </div>

          <p className="text-xs text-gray-400 text-center pt-4">
            © 2024 Alex Chen. All rights reserved.
          </p>
        </div>
      </div>
    </article>
  );
}
