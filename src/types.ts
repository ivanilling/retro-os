export interface WindowState {
  id: string;
  title: string;
  appId: string;
  zIndex: number;
  position: { x: number; y: number };
  size: { w: number; h: number };
  isMinimized: boolean;
  isMaximized: boolean;
}

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  defaultSize: { w: number; h: number };
  component: React.LazyExoticComponent<React.ComponentType>;
}

export interface DesktopIconPosition {
  id: string;
  x: number;
  y: number;
}

export interface DesktopState {
  openWindows: WindowState[];
  iconPositions: DesktopIconPosition[];
  notepadContent: string;
  nextZIndex: number;
}

export interface SettingsState {
  crtEnabled: boolean;
  soundEnabled: boolean;
  performanceMode: boolean;
}
