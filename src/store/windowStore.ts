import { create } from 'zustand';
import type { WindowState, DesktopIconPosition } from '../types';

interface WindowStore {
  windows: WindowState[];
  iconPositions: DesktopIconPosition[];
  notepadContent: string;
  nextZIndex: number;
  startMenuOpen: boolean;
  activeWindowId: string | null;

  openWindow: (id: string, title: string, appId: string, defaultSize: { w: number; h: number }) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, w: number, h: number) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  setIconPositions: (positions: DesktopIconPosition[]) => void;
  setNotepadContent: (content: string) => void;
  restoreState: (state: Partial<{ windows: WindowState[]; iconPositions: DesktopIconPosition[]; notepadContent: string }>) => void;
}

const loadPersistedState = () => {
  try {
    const saved = localStorage.getItem('retro-os-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
  }
  return null;
};

const persisted = loadPersistedState();

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: persisted?.windows || [],
  iconPositions: persisted?.iconPositions || [],
  notepadContent: persisted?.notepadContent || '',
  nextZIndex: persisted?.windows?.length ? Math.max(...persisted.windows.map((w: WindowState) => w.zIndex)) + 1 : 100,
  startMenuOpen: false,
  activeWindowId: null,

  openWindow: (id, title, appId, defaultSize) => {
    const existing = get().windows.find(w => w.id === id);
    if (existing) {
      get().focusWindow(id);
      if (existing.isMinimized) {
        set(state => ({
          windows: state.windows.map(w =>
            w.id === id ? { ...w, isMinimized: false } : w
          ),
        }));
      }
      return;
    }

    const offset = get().windows.length * 30;
    const newWindow: WindowState = {
      id,
      title,
      appId,
      zIndex: get().nextZIndex,
      position: { x: 80 + offset, y: 40 + offset },
      size: defaultSize,
      isMinimized: false,
      isMaximized: false,
    };

    set(state => ({
      windows: [...state.windows, newWindow],
      nextZIndex: state.nextZIndex + 1,
      activeWindowId: id,
    }));
  },

  closeWindow: (id) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindowId: state.windows.length > 1
        ? state.windows.filter(w => w.id !== id).reduce((a, b) => a.zIndex > b.zIndex ? a : b).id
        : null,
    }));
  },

  focusWindow: (id) => {
    const newZ = get().nextZIndex;
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w
      ),
      nextZIndex: newZ + 1,
      activeWindowId: id,
    }));
  },

  minimizeWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: null,
    }));
  },

  maximizeWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMaximized: true } : w
      ),
    }));
  },

  restoreWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMaximized: false } : w
      ),
    }));
  },

  moveWindow: (id, x, y) => {
    const clampedX = Math.max(0, Math.min(x, window.innerWidth - 100));
    const clampedY = Math.max(0, Math.min(y, window.innerHeight - 120));
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, position: { x: clampedX, y: clampedY } } : w
      ),
    }));
  },

  resizeWindow: (id, w, h) => {
    const clampedW = Math.max(300, Math.min(w, window.innerWidth));
    const clampedH = Math.max(200, Math.min(h, window.innerHeight - 40));
    set(state => ({
      windows: state.windows.map(win =>
        win.id === id ? { ...win, size: { w: clampedW, h: clampedH } } : win
      ),
    }));
  },

  toggleStartMenu: () => set(state => ({ startMenuOpen: !state.startMenuOpen })),
  closeStartMenu: () => set({ startMenuOpen: false }),

  setIconPositions: (positions) => set({ iconPositions: positions }),
  setNotepadContent: (content) => set({ notepadContent: content }),

  restoreState: (partialState: Partial<{ windows: WindowState[]; iconPositions: DesktopIconPosition[]; notepadContent: string }>) => set(partialState),
}));
