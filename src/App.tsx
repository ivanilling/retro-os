import React, { useEffect, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowStore } from './store/windowStore';
import Window from './components/Window';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import CRTOverlay from './components/CRTOverlay';

// Persist state to localStorage
function usePersistState() {
  const windows = useWindowStore(s => s.windows);
  const iconPositions = useWindowStore(s => s.iconPositions);
  const notepadContent = useWindowStore(s => s.notepadContent);

  useEffect(() => {
    const state = { windows, iconPositions, notepadContent };
    try {
      localStorage.setItem('retro-os-state', JSON.stringify(state));
    } catch (e) {
      // Storage full or unavailable
    }
  }, [windows, iconPositions, notepadContent]);
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[99999]">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🖥️</div>
        <div className="text-green-400 font-mono text-sm">
          <p>RETRO OS v1.0</p>
          <p className="mt-2 animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const windows = useWindowStore(s => s.windows);
  usePersistState();

  // Prevent default context menu on desktop
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[role="application"]') || target.closest('.desktop-area')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black select-none">
      <Suspense fallback={<LoadingScreen />}>
        {/* Desktop */}
        <Desktop />

        {/* Windows */}
        <AnimatePresence>
          {windows.map(win => (
            <Window key={win.id} windowState={win} />
          ))}
        </AnimatePresence>

        {/* Taskbar */}
        <Taskbar />

        {/* CRT Effect Overlay */}
        <CRTOverlay />
      </Suspense>
    </div>
  );
}
