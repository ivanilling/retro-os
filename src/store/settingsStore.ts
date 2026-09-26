import { create } from 'zustand';
import type { SettingsState } from '../types';

interface SettingsStore extends SettingsState {
  toggleCRT: () => void;
  toggleSound: () => void;
  togglePerformanceMode: () => void;
}

const loadSettings = (): SettingsState => {
  try {
    const saved = localStorage.getItem('retro-os-settings');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return { crtEnabled: true, soundEnabled: true, performanceMode: false };
};

const saved = loadSettings();

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...saved,

  toggleCRT: () => {
    set(state => {
      const newSettings = { ...state, crtEnabled: !state.crtEnabled };
      localStorage.setItem('retro-os-settings', JSON.stringify(newSettings));
      return { crtEnabled: !state.crtEnabled };
    });
  },

  toggleSound: () => {
    set(state => {
      const newSettings = { ...state, soundEnabled: !state.soundEnabled };
      localStorage.setItem('retro-os-settings', JSON.stringify(newSettings));
      return { soundEnabled: !state.soundEnabled };
    });
  },

  togglePerformanceMode: () => {
    set(state => {
      const newSettings = { ...state, performanceMode: !state.performanceMode };
      localStorage.setItem('retro-os-settings', JSON.stringify(newSettings));
      return { performanceMode: !state.performanceMode };
    });
  },
}));
