import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// Terminal Icon - 16x16 pixel art
export const TerminalIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Background */}
    <rect width="16" height="16" fill="#000000" />
    {/* Border */}
    <rect x="1" y="1" width="14" height="14" fill="#c0c0c0" />
    <rect x="2" y="2" width="12" height="12" fill="#000080" />
    {/* Prompt symbol */}
    <rect x="3" y="4" width="1" height="1" fill="#ffffff" />
    <rect x="4" y="5" width="1" height="1" fill="#ffffff" />
    <rect x="5" y="6" width="1" height="1" fill="#ffffff" />
    <rect x="6" y="7" width="1" height="1" fill="#ffffff" />
    <rect x="7" y="8" width="1" height="1" fill="#ffffff" />
    {/* Cursor */}
    <rect x="8" y="8" width="2" height="1" fill="#00ff00" />
  </svg>
);

// Notepad Icon - 16x16 pixel art
export const NotepadIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Paper */}
    <rect x="3" y="2" width="10" height="12" fill="#ffffff" />
    <rect x="3" y="2" width="10" height="1" fill="#808080" />
    <rect x="3" y="13" width="10" height="1" fill="#808080" />
    <rect x="3" y="2" width="1" height="12" fill="#808080" />
    <rect x="12" y="2" width="1" height="12" fill="#808080" />
    {/* Lines */}
    <rect x="5" y="4" width="6" height="1" fill="#000000" />
    <rect x="5" y="6" width="6" height="1" fill="#000000" />
    <rect x="5" y="8" width="6" height="1" fill="#000000" />
    <rect x="5" y="10" width="4" height="1" fill="#000000" />
    {/* Pencil */}
    <rect x="11" y="11" width="1" height="1" fill="#ffff00" />
    <rect x="12" y="10" width="1" height="1" fill="#ffff00" />
    <rect x="13" y="9" width="1" height="1" fill="#ffff00" />
  </svg>
);

// Paint Icon - 16x16 pixel art
export const PaintIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Palette */}
    <rect x="2" y="4" width="12" height="8" fill="#c0c0c0" />
    <rect x="2" y="4" width="12" height="1" fill="#ffffff" />
    <rect x="2" y="11" width="12" height="1" fill="#808080" />
    {/* Paint colors */}
    <rect x="3" y="5" width="2" height="2" fill="#ff0000" />
    <rect x="6" y="5" width="2" height="2" fill="#00ff00" />
    <rect x="9" y="5" width="2" height="2" fill="#0000ff" />
    <rect x="3" y="8" width="2" height="2" fill="#ffff00" />
    <rect x="6" y="8" width="2" height="2" fill="#ff00ff" />
    <rect x="9" y="8" width="2" height="2" fill="#00ffff" />
    {/* Brush */}
    <rect x="12" y="2" width="1" height="1" fill="#808080" />
    <rect x="13" y="3" width="1" height="1" fill="#808080" />
    <rect x="14" y="4" width="1" height="1" fill="#808080" />
  </svg>
);



// Games Folder Icon - 16x16 pixel art
export const GamesFolderIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Folder back */}
    <rect x="1" y="4" width="14" height="10" fill="#ffff00" />
    <rect x="1" y="4" width="14" height="1" fill="#ffffff" />
    <rect x="1" y="13" width="14" height="1" fill="#808000" />
    {/* Folder tab */}
    <rect x="1" y="3" width="6" height="1" fill="#ffff00" />
    <rect x="1" y="3" width="6" height="1" fill="#ffffff" />
    {/* Game controller */}
    <rect x="5" y="7" width="6" height="4" fill="#808080" />
    <rect x="6" y="8" width="1" height="1" fill="#000000" />
    <rect x="8" y="8" width="1" height="1" fill="#000000" />
    <rect x="7" y="9" width="1" height="1" fill="#000000" />
    <rect x="9" y="9" width="1" height="1" fill="#ff0000" />
  </svg>
);

// My Computer Icon - 16x16 pixel art
export const MyComputerIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Monitor */}
    <rect x="2" y="2" width="12" height="9" fill="#c0c0c0" />
    <rect x="3" y="3" width="10" height="7" fill="#000080" />
    {/* Screen content */}
    <rect x="4" y="4" width="3" height="2" fill="#00ff00" />
    <rect x="8" y="4" width="3" height="1" fill="#ffffff" />
    <rect x="8" y="6" width="3" height="1" fill="#ffffff" />
    {/* Stand */}
    <rect x="6" y="11" width="4" height="1" fill="#808080" />
    <rect x="5" y="12" width="6" height="1" fill="#808080" />
    {/* Base */}
    <rect x="4" y="13" width="8" height="1" fill="#c0c0c0" />
  </svg>
);

// Recycle Bin Icon - 16x16 pixel art
export const RecycleBinIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Bin */}
    <rect x="3" y="4" width="10" height="10" fill="#c0c0c0" />
    <rect x="3" y="4" width="10" height="1" fill="#ffffff" />
    <rect x="3" y="13" width="10" height="1" fill="#808080" />
    {/* Lid */}
    <rect x="2" y="3" width="12" height="1" fill="#808080" />
    <rect x="6" y="2" width="4" height="1" fill="#808080" />
    {/* Lines */}
    <rect x="5" y="6" width="1" height="6" fill="#808080" />
    <rect x="7" y="6" width="1" height="6" fill="#808080" />
    <rect x="9" y="6" width="1" height="6" fill="#808080" />
    {/* Recycle arrows */}
    <rect x="4" y="8" width="1" height="1" fill="#00ff00" />
    <rect x="5" y="7" width="1" height="1" fill="#00ff00" />
    <rect x="10" y="8" width="1" height="1" fill="#00ff00" />
    <rect x="11" y="9" width="1" height="1" fill="#00ff00" />
  </svg>
);

// Minesweeper Icon - 16x16 pixel art
export const MinesweeperIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Background */}
    <rect width="16" height="16" fill="#c0c0c0" />
    {/* Mine */}
    <rect x="6" y="6" width="4" height="4" fill="#000000" />
    <rect x="7" y="5" width="2" height="1" fill="#000000" />
    <rect x="7" y="10" width="2" height="1" fill="#000000" />
    <rect x="5" y="7" width="1" height="2" fill="#000000" />
    <rect x="10" y="7" width="1" height="2" fill="#000000" />
    {/* Spikes */}
    <rect x="5" y="5" width="1" height="1" fill="#000000" />
    <rect x="10" y="5" width="1" height="1" fill="#000000" />
    <rect x="5" y="10" width="1" height="1" fill="#000000" />
    <rect x="10" y="10" width="1" height="1" fill="#000000" />
    {/* Flag */}
    <rect x="12" y="3" width="1" height="6" fill="#808080" />
    <rect x="13" y="3" width="2" height="2" fill="#ff0000" />
  </svg>
);

// Snake Icon - 16x16 pixel art
export const SnakeIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Background */}
    <rect width="16" height="16" fill="#000000" />
    {/* Snake body */}
    <rect x="2" y="8" width="2" height="2" fill="#00ff00" />
    <rect x="4" y="8" width="2" height="2" fill="#00ff00" />
    <rect x="6" y="8" width="2" height="2" fill="#00ff00" />
    <rect x="8" y="8" width="2" height="2" fill="#00ff00" />
    <rect x="8" y="6" width="2" height="2" fill="#00ff00" />
    <rect x="8" y="4" width="2" height="2" fill="#00ff00" />
    <rect x="10" y="4" width="2" height="2" fill="#00ff00" />
    {/* Head */}
    <rect x="12" y="4" width="2" height="2" fill="#00ff00" />
    {/* Eye */}
    <rect x="13" y="4" width="1" height="1" fill="#ffffff" />
    {/* Food */}
    <rect x="3" y="3" width="2" height="2" fill="#ff0000" />
  </svg>
);

// Tetris Icon - 16x16 pixel art
export const TetrisIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Background */}
    <rect width="16" height="16" fill="#000000" />
    {/* T-piece */}
    <rect x="4" y="2" width="2" height="2" fill="#800080" />
    <rect x="6" y="2" width="2" height="2" fill="#800080" />
    <rect x="8" y="2" width="2" height="2" fill="#800080" />
    <rect x="6" y="4" width="2" height="2" fill="#800080" />
    {/* L-piece */}
    <rect x="2" y="6" width="2" height="2" fill="#ffa500" />
    <rect x="2" y="8" width="2" height="2" fill="#ffa500" />
    <rect x="4" y="8" width="2" height="2" fill="#ffa500" />
    <rect x="6" y="8" width="2" height="2" fill="#ffa500" />
    {/* I-piece */}
    <rect x="10" y="6" width="2" height="2" fill="#00ffff" />
    <rect x="10" y="8" width="2" height="2" fill="#00ffff" />
    <rect x="10" y="10" width="2" height="2" fill="#00ffff" />
    <rect x="10" y="12" width="2" height="2" fill="#00ffff" />
    {/* S-piece */}
    <rect x="4" y="12" width="2" height="2" fill="#00ff00" />
    <rect x="6" y="12" width="2" height="2" fill="#00ff00" />
    <rect x="6" y="10" width="2" height="2" fill="#00ff00" />
    <rect x="8" y="10" width="2" height="2" fill="#00ff00" />
  </svg>
);

// Dino Runner Icon - 16x16 pixel art
export const DinoIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Background */}
    <rect width="16" height="16" fill="#ffffff" />
    {/* Dino body */}
    <rect x="4" y="6" width="6" height="4" fill="#535353" />
    {/* Head */}
    <rect x="10" y="4" width="3" height="3" fill="#535353" />
    {/* Eye */}
    <rect x="12" y="4" width="1" height="1" fill="#ffffff" />
    {/* Tail */}
    <rect x="2" y="7" width="2" height="2" fill="#535353" />
    {/* Legs */}
    <rect x="5" y="10" width="1" height="2" fill="#535353" />
    <rect x="8" y="10" width="1" height="2" fill="#535353" />
    {/* Cactus */}
    <rect x="13" y="8" width="1" height="4" fill="#535353" />
    <rect x="12" y="9" width="1" height="2" fill="#535353" />
    {/* Ground */}
    <rect x="0" y="14" width="16" height="1" fill="#535353" />
  </svg>
);

// Settings Icon - 16x16 pixel art
export const SettingsIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Gear */}
    <rect x="6" y="2" width="4" height="2" fill="#808080" />
    <rect x="6" y="12" width="4" height="2" fill="#808080" />
    <rect x="2" y="6" width="2" height="4" fill="#808080" />
    <rect x="12" y="6" width="2" height="4" fill="#808080" />
    {/* Center */}
    <rect x="5" y="5" width="6" height="6" fill="#c0c0c0" />
    <rect x="6" y="6" width="4" height="4" fill="#808080" />
    <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
    {/* Diagonal teeth */}
    <rect x="3" y="3" width="2" height="2" fill="#808080" />
    <rect x="11" y="3" width="2" height="2" fill="#808080" />
    <rect x="3" y="11" width="2" height="2" fill="#808080" />
    <rect x="11" y="11" width="2" height="2" fill="#808080" />
  </svg>
);

// About Icon - 16x16 pixel art
export const AboutIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Circle */}
    <rect x="4" y="2" width="8" height="1" fill="#0000ff" />
    <rect x="3" y="3" width="10" height="1" fill="#0000ff" />
    <rect x="2" y="4" width="12" height="8" fill="#0000ff" />
    <rect x="3" y="12" width="10" height="1" fill="#0000ff" />
    <rect x="4" y="13" width="8" height="1" fill="#0000ff" />
    {/* Letter i */}
    <rect x="7" y="5" width="2" height="2" fill="#ffffff" />
    <rect x="7" y="8" width="2" height="4" fill="#ffffff" />
  </svg>
);

// Music Player Icon - 16x16 pixel art
export const MusicPlayerIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* CD/Disc */}
    <rect x="3" y="3" width="10" height="10" fill="#c0c0c0" />
    <rect x="4" y="4" width="8" height="8" fill="#808080" />
    <rect x="6" y="6" width="4" height="4" fill="#000000" />
    <rect x="7" y="7" width="2" height="2" fill="#c0c0c0" />
    {/* Musical note */}
    <rect x="11" y="2" width="1" height="5" fill="#000000" />
    <rect x="12" y="2" width="2" height="2" fill="#000000" />
    <rect x="10" y="6" width="3" height="2" fill="#000000" />
  </svg>
);

// Calculator Icon - 16x16 pixel art
export const CalculatorIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Body */}
    <rect x="3" y="2" width="10" height="12" fill="#c0c0c0" />
    <rect x="3" y="2" width="10" height="1" fill="#ffffff" />
    <rect x="3" y="13" width="10" height="1" fill="#808080" />
    {/* Display */}
    <rect x="4" y="3" width="8" height="3" fill="#00ff00" />
    {/* Buttons */}
    <rect x="4" y="7" width="2" height="2" fill="#808080" />
    <rect x="7" y="7" width="2" height="2" fill="#808080" />
    <rect x="10" y="7" width="2" height="2" fill="#808080" />
    <rect x="4" y="10" width="2" height="2" fill="#808080" />
    <rect x="7" y="10" width="2" height="2" fill="#808080" />
    <rect x="10" y="10" width="2" height="2" fill="#ff0000" />
  </svg>
);
