import React from 'react';
import {
  TerminalIcon,
  NotepadIcon,
  PaintIcon,
  BrowserIcon,
  GamesFolderIcon,
  MyComputerIcon,
  RecycleBinIcon,
  MinesweeperIcon,
  SnakeIcon,
  TetrisIcon,
  DinoIcon,
  SettingsIcon,
  AboutIcon,
  MusicPlayerIcon,
  CalculatorIcon,
} from './PixelIcons';

interface AppIconProps {
  name: string;
  size?: number;
  className?: string;
}

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  terminal: TerminalIcon,
  notepad: NotepadIcon,
  paint: PaintIcon,
  browser: BrowserIcon,
  'games-folder': GamesFolderIcon,
  'my-computer': MyComputerIcon,
  'recycle-bin': RecycleBinIcon,
  minesweeper: MinesweeperIcon,
  snake: SnakeIcon,
  tetris: TetrisIcon,
  dino: DinoIcon,
  settings: SettingsIcon,
  about: AboutIcon,
  'music-player': MusicPlayerIcon,
  calculator: CalculatorIcon,
  folder: GamesFolderIcon, // Default folder icon
};

export const AppIcon: React.FC<AppIconProps> = ({ name, size = 32, className }) => {
  const IconComponent = iconMap[name] || iconMap.folder;
  return <IconComponent size={size} className={className} />;
};

export default AppIcon;
