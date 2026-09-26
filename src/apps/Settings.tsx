import React from 'react';
import { useSettingsStore } from '../store/settingsStore';

export default function Settings() {
  const crtEnabled = useSettingsStore(s => s.crtEnabled);
  const soundEnabled = useSettingsStore(s => s.soundEnabled);
  const performanceMode = useSettingsStore(s => s.performanceMode);
  const toggleCRT = useSettingsStore(s => s.toggleCRT);
  const toggleSound = useSettingsStore(s => s.toggleSound);
  const togglePerformanceMode = useSettingsStore(s => s.togglePerformanceMode);

  return (
    <article 
      className="h-full w-full flex flex-col bg-gray-100"
      role="main" 
      aria-label="Settings"
    >
      {/* Header */}
      <div className="bg-gray-200 border-b-2 border-gray-400 p-3 shrink-0">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>⚙️</span> System Settings
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Display Settings */}
          <fieldset className="border-2 border-gray-300 p-3" style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff' }}>
            <legend className="text-sm font-bold text-gray-700 px-1">Display</legend>
            
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={crtEnabled}
                onChange={toggleCRT}
                className="w-4 h-4"
                aria-label="Enable CRT scanline effect"
              />
              <span className="text-sm">CRT Scanline Effect</span>
            </label>
            
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={performanceMode}
                onChange={togglePerformanceMode}
                className="w-4 h-4"
                aria-label="Enable performance mode"
              />
              <span className="text-sm">Performance Mode (disables heavy shaders)</span>
            </label>
          </fieldset>

          {/* Audio Settings */}
          <fieldset className="border-2 border-gray-300 p-3" style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff' }}>
            <legend className="text-sm font-bold text-gray-700 px-1">Audio</legend>
            
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={toggleSound}
                className="w-4 h-4"
                aria-label="Enable UI sounds"
              />
              <span className="text-sm">UI Sound Effects</span>
            </label>
          </fieldset>

          {/* System Info */}
          <fieldset className="border-2 border-gray-300 p-3" style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff' }}>
            <legend className="text-sm font-bold text-gray-700 px-1">System Information</legend>
            <div className="text-xs text-gray-600 space-y-1">
              <p>OS: RetroOS v1.0</p>
              <p>Kernel: React 18 + TypeScript</p>
              <p>Desktop: Zustand State Manager</p>
              <p>Theme: Windows 95 / Mac OS 8</p>
              <p>Renderer: Tailwind CSS v4</p>
              <p>Animations: Framer Motion</p>
            </div>
          </fieldset>

          {/* Reset */}
          <div className="pt-2">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-1.5 text-sm bg-gray-200 border-2 border-gray-400 hover:bg-gray-300 active:bg-gray-400"
              style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
            >
              Reset All Data
            </button>
            <p className="text-xs text-gray-500 mt-1">Clears all saved data and reloads</p>
          </div>
        </div>
      </div>
    </article>
  );
}
