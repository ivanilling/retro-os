# Retro OS Portfolio

A production-grade "Retro Operating System" portfolio website built with React 18+, TypeScript, Tailwind CSS, Framer Motion, and Zustand.

## 🖥️ Design Aesthetic

Windows 95 / Mac OS 8 hybrid with modern accessibility standards. Pixel-perfect but responsive.

## 💻 Enhanced Terminal

A fully-featured terminal emulator with advanced commands and visual effects:

### New Commands:
- **neofetch** - Display ASCII art laptop with system information (OS, Kernel, Resolution, etc.)
- **matrix** - Toggle Matrix-style digital rain effect overlay (press again to disable)
- **help** - List all available commands with descriptions
- **clear** - Clear terminal screen
- **echo [text]** - Print text to terminal
- **date** - Show current date and time
- **whoami** - Display current user
- **ls** - List directory contents
- **cat [file]** - Display file contents
- **projects** - List portfolio projects
- **contact** - Show contact information
- **skills** - Display technical skills

### UX Improvements:
- **Command History** - Use ↑/↓ arrow keys to navigate through previous commands
- **Tab Completion** - Press Tab to auto-complete command names
- **Auto-scroll** - Terminal automatically scrolls to bottom on new output
- **Blinking Cursor** - Visual indicator for input position
- **Color-coded Output** - Cyan for input, green for output, red for errors

### Technical Features:
- Modular command system in `commands.ts` for easy extension
- Matrix effect using HTML5 Canvas with `requestAnimationFrame`
- Dynamic resolution detection for neofetch
- Context-based command execution for terminal control

## 💣 Minesweeper Game

A fully functional Minesweeper implementation with classic Windows 95 aesthetics:

### Features:
- **Classic Gameplay**: 10x10 grid with 15 mines
- **Left Click**: Reveal cells
- **Right Click**: Place/remove flags
- **Smart First Click**: First click never hits a mine
- **Flood Fill**: Empty cells automatically reveal neighbors
- **Timer & Counter**: Track time elapsed and flags remaining
- **Win/Loss Detection**: Automatic game state detection
- **Performance Optimized**: React.memo for individual cells

### How to Play:
1. Open Minesweeper from Start Menu → Games
2. Left-click any cell to start the game
3. Right-click to flag suspected mines
4. Numbers indicate adjacent mines (1-8)
5. Clear all non-mine cells to win!

### Technical Details:
- Custom `useMinesweeper` hook manages game state
- Flood fill algorithm for revealing empty areas
- CSS Grid layout with Windows 95 inset/outset borders
- Fully accessible with ARIA labels and keyboard navigation

## 🎨 Paint Application

A MS Paint-like drawing application built with HTML5 Canvas API:

### Features:
- **Drawing Tools**: Pencil (freehand), Line, Rectangle, Eraser
- **Color Selection**: 16-color preset palette + custom color picker
- **Brush Size**: Adjustable from 1px to 20px
- **Undo**: History tracking for up to 20 states
- **Save as PNG**: Download your artwork
- **Clear Canvas**: Start fresh
- **Responsive Canvas**: Automatically adapts to window resize while preserving drawings

### How to Use:
1. Open Paint from Start Menu → Applications
2. Select a tool from the toolbar (Pencil, Line, Rectangle, or Eraser)
3. Choose a color from the palette or use the custom color picker
4. Adjust brush size with the slider
5. Draw on the canvas
6. Use Undo to fix mistakes
7. Click Save to download your artwork as PNG

### Technical Details:
- HTML5 Canvas API for all drawing operations
- `requestAnimationFrame` for smooth line/rectangle previews
- `ResizeObserver` for responsive canvas with content preservation
- Accurate mouse coordinate mapping using `getBoundingClientRect()`
- History stack using `ImageData` for undo functionality
- Windows 95 aesthetic with inset/outset borders

## ✨ Features

### Window Management Engine
- Custom `useWindowManager` hook powered by Zustand
- Dynamic z-index management (click to focus)
- Draggable and resizable windows with boundary constraints
- Minimize, maximize, and close operations
- Snap-to-edge logic for maximization

### Applications
- **Terminal**: Functional CLI with command history, supports `help`, `projects`, `contact`, `clear`, `neofetch`, and more
- **Notepad**: Rich text editor with localStorage auto-save
- **Gallery**: Project showcase with lightbox and keyboard navigation (arrow keys)
- **Browser**: Mock browser with URL bar and external links
- **Settings**: Toggle CRT effects, sound, and performance mode
- **About**: Portfolio information

### Desktop Environment
- Draggable desktop icons with position persistence
- Taskbar with Start Menu, open app tabs, and system tray
- Real-time clock
- Sound toggle

### Visual Effects
- CRT scanline overlay with vignette
- Performance Mode toggle for low-end devices
- Subtle UI sounds via Web Audio API (no autoplay)

### Accessibility & SEO
- Semantic HTML (`<main>`, `<nav>`, `<article>` inside windows)
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- Screen reader support
- SEO content present in DOM (hidden with `.sr-only`)
- `prefers-reduced-motion` support

### Persistence
- Full desktop state saved to localStorage
- Window positions, sizes, and open state restored on reload
- Notepad content auto-saved
- Icon positions persisted

## 🏗️ Architecture

```
src/
├── App.tsx                    # Main entry point
├── main.tsx                   # React DOM render
├── index.css                  # Global styles + CRT effects
├── types.ts                   # TypeScript type definitions
├── store/
│   ├── windowStore.ts         # Zustand store for window management
│   └── settingsStore.ts       # Zustand store for settings
├── hooks/
│   └── useAudio.ts            # Web Audio API sound system
├── components/
│   ├── Window.tsx             # Window component (drag, resize, focus)
│   ├── Desktop.tsx            # Desktop environment
│   ├── DesktopIcon.tsx        # Draggable desktop icons
│   ├── Taskbar.tsx            # Bottom taskbar
│   ├── StartMenu.tsx          # Start menu with keyboard nav
│   └── CRTOverlay.tsx         # CRT scanline effect
└── apps/
    ├── registry.ts            # App registry (lazy-loaded)
    ├── Terminal.tsx           # CLI terminal emulator
    ├── Notepad.tsx            # Text editor with auto-save
    ├── ImageViewer.tsx        # Project gallery with lightbox
    ├── Browser.tsx            # Mock browser
    ├── Settings.tsx           # System settings
    └── About.tsx              # About/portfolio info
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## 📝 How to Add New Apps

### 1. Create the App Component

Create a new file in `src/apps/YourApp.tsx`:

```tsx
import React from 'react';

export default function YourApp() {
  return (
    <article className="h-full w-full p-4" role="main" aria-label="Your App">
      <h2>Your App Content</h2>
      {/* Your app logic here */}
    </article>
  );
}
```

### 2. Register the App

Add your app to `src/apps/registry.ts`:

```tsx
import React from 'react';
import type { AppDefinition } from '../types';

export const appRegistry: AppDefinition[] = [
  // ... existing apps
  {
    id: 'your-app',           // Unique identifier
    title: 'Your App',        // Display title
    icon: '🎯',              // Emoji icon
    defaultSize: { w: 500, h: 400 },  // Default window size
    component: React.lazy(() => import('../apps/YourApp')),  // Lazy-loaded component
  },
];
```

### 3. (Optional) Add Desktop Icon

If you want the app to appear on the desktop, add it to the `desktopApps` filter in `src/components/Desktop.tsx`:

```tsx
const desktopApps = appRegistry.filter(app => 
  !['settings', 'about'].includes(app.id)
);
```

### 4. (Optional) Add to Start Menu

Apps are automatically added to the Start Menu from the registry. To categorize differently, modify `src/components/StartMenu.tsx`.

### 5. (Optional) Add Taskbar Icon

Update the icon mapping in `src/components/Taskbar.tsx` if your app needs a custom icon in the taskbar.

## 🎨 Customization

### Theme Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --color-desktop: #008080;
  --color-titlebar: #0a246a;
  --color-taskbar: #c0c0c0;
}
```

### Window Defaults
Modify `defaultSize` in the app registry for different initial window dimensions.

### Sound Effects
Edit `src/hooks/useAudio.ts` to change frequencies, durations, or add new sounds.

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety (Strict Mode)
- **Tailwind CSS v4** - Utility-first styling
- **Zustand** - Global state management
- **Framer Motion** - Physics-based animations
- **Web Audio API** - Sound effects (no external dependencies)
- **Vite** - Build tool

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive layout)

## 📄 License

MIT
