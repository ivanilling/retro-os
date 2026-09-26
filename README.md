# Retro OS Portfolio

A production-grade "Retro Operating System" portfolio website built with React 18+, TypeScript, Tailwind CSS, Framer Motion, and Zustand.

## 🖥️ Design Aesthetic

Windows 95 / Mac OS 8 hybrid with modern accessibility standards. Pixel-perfect but responsive.

## 📁 FolderViewer Component

Windows 95 Explorer-style file browser for navigating the virtual file system:

### Features:
- **Breadcrumb Navigation** - Clickable path segments (C: > Program Files > Games)
- **Toolbar** - "Up" button to navigate to parent folder
- **Address Bar** - Shows current path with clickable segments
- **Grid View** - Icons displayed in 4-column grid
- **Selection** - Single-click to select, double-click to open
- **Status Bar** - Shows object count and selected item
- **Keyboard Navigation** - Tab to focus items, Enter to open
- **Win95 Aesthetic** - Inset/outset borders, gray toolbar, blue selection

### Usage:
```tsx
<FolderViewer path="/Program Files/Games" />
```

### Technical Details:
- Reads from virtual file system defined in `fileSystem.ts`
- Supports nested folder navigation
- Launches apps via window manager on double-click
- Responsive grid layout
- Accessible with ARIA labels and keyboard support

## 🧮 Calculator

Classic Windows 95-style calculator with full keyboard support:

### Features:
- **Standard Layout** - Digits 0-9, operations (+, -, *, /), decimal point
- **Win95 Styling** - Inset display, outset buttons with 3D effect
- **Keyboard Support** - Full numpad and keyboard input
  - Digits: 0-9
  - Operations: +, -, *, /
  - Enter or = for equals
  - Escape or C for clear
  - Backspace to delete last digit
  - Decimal point (.)
- **Error Handling** - Division by zero returns 0
- **Chain Operations** - Can chain multiple operations

### Controls:
- **Mouse** - Click buttons to input
- **Keyboard** - Full keyboard support for all operations
- **Clear (C)** - Reset calculator to 0

## 📎 Clippy Assistant

Animated Office Assistant with proper paperclip wire shape:

### Visual Design:
- **Bent Wire Paperclip** - Double-loop wire shape (not an egg!)
- **Eyes on Wire Loops** - Positioned ON the wire, not floating on a body
- **Animated Eyebrows** - Expressive eyebrows that move (SVG animation)
- **Proper Proportions** - Authentic paperclip geometry

### Features:
- **Smart Appearance** - Appears after 30 seconds of inactivity or randomly every 2-5 minutes
- **Helpful Tips** - Random tips about using the OS
  - "Looks like you're coding a portfolio. Need help?"
  - "Have you tried the Snake game?"
  - "Did you know you can drag windows by their title bar?"
  - And more!
- **Speech Bubble** - Classic comic-style speech bubble with arrow
- **Dismissible** - Click X button to close
- **Minimizable** - Click Clippy to minimize/restore

### Technical Details:
- SVG paths for precise wire shape
- Eyes positioned on outer wire loops
- Animated eyebrows using SVG `<animate>` element
- Shine effect for 3D appearance
- Drop shadow for depth

## 💙 BSOD (Blue Screen of Death)

Scary and realistic Windows blue screen with audio:

### Trigger Methods:
1. **Terminal Command** - Type `sudo crash` in Terminal

### Visual Design:
- **Full-Screen Overlay** - Classic blue background (#0000AA)
- **White Pixel Font** - Courier New monospace
- **Static Text** - NO animations (authentic BSOD experience)
- **Error Code** - STOP: 0x000000D1 (DRIVER_IRQL_NOT_LESS_OR_EQUAL)

### Audio (Critical):
- **Hard Drive Error Sound** - 0.5s loop of broken/stutter sound
- **Square Wave Oscillator** - 80Hz base frequency
- **LFO Modulation** - 15Hz for "broken" stutter effect
- **Volume** - 15% gain for jarring experience
- **Auto-Stop** - Sound stops 0.5s before reboot

### Behavior:
- **Instant UI Freeze** - Disables all mouse/keyboard events
- **No Escape** - Cannot be dismissed manually
- **Auto-Reload** - `window.location.reload()` after 5 seconds
- **Physical Memory Dump** - Authentic error messages

### Technical Details:
- Web Audio API for procedural sound generation
- LFO (Low Frequency Oscillator) for stutter effect
- Event listeners with `capture: true` to freeze UI
- Automatic page reload simulates real reboot
- Cursor set to `none` for complete freeze

## 🖱️ Context Menu

Custom right-click menu for the desktop with smart refresh:

### Features:
- **Dynamic Positioning** - Appears at mouse cursor location
- **Boundary Detection** - Adjusts position to stay within viewport
- **Win95 Styling** - Classic menu with hover effects
- **Keyboard Support** - Press Escape to close

### Menu Items:
- **🔄 Refresh** - Re-render desktop icons from VFS state (NO page reload!)
- **🖼️ Change Wallpaper** - (Coming soon)
- **📁 New Folder** - (Coming soon)
- **⚙️ Properties** - Open Settings window

### Smart Refresh:
- **No Page Reload** - Uses React state to force re-render
- **VFS Integration** - Reads fresh data from virtual file system
- **Instant Update** - Icons refresh immediately without flicker
- **State Preservation** - Window positions and states preserved

### Usage:
- Right-click on empty desktop area
- Click menu items to execute actions
- Click outside menu to close
- Press Escape to dismiss

### Technical Details:
- `refreshKey` state forces component re-render
- Desktop icons read from VFS on each render
- No `window.location.reload()` needed
- Preserves all window states and positions

## 🌐 Browser (Smart Fallback)

Enhanced browser with intelligent fallback for blocked sites:

### Features:
- **Iframe Rendering** - Load websites in embedded frame
- **Address Bar** - Enter any URL with auto-https
- **Bookmarks** - Quick access to safe sites
  - Wikipedia
  - MDN Web Docs
  - GitHub
- **Smart Fallback** - "Retro Search Engine" when iframe fails
- **Open in New Tab** - Permanent button in toolbar
- **Search Engine** - Built-in search bar (opens in new tab)
- **Loading State** - Visual feedback during page load
- **Security** - Sandboxed iframe with limited permissions

### Smart Browser Logic:
1. **Try iframe** - Attempt to load URL in embedded frame
2. **Detect failure** - If X-Frame-Options blocks or error occurs
3. **Show fallback** - Display "Retro Search Engine" UI
4. **Search opens in new tab** - All searches use `window.open()`
5. **Direct links** - "Open in New Tab" button always available

### Fallback UI:
When a site blocks iframe embedding:
- Shows "Retro Search Engine" with search bar
- Search results open in NEW TAB (not iframe)
- "Open [URL] in New Tab" button for direct access
- Quick links to bookmarked sites
- Friendly error message explaining the issue

### Toolbar Features:
- **Refresh** - Reload current page
- **New Tab** - Open current URL in new browser tab
- **Address Bar** - Enter any URL
- **Go** - Navigate to URL
- **Bookmarks** - Quick access buttons

### Bookmarks:
Pre-loaded safe sites that allow framing:
- Wikipedia (en.wikipedia.org)
- MDN Web Docs (developer.mozilla.org)
- GitHub (github.com)

### Technical Details:
- `sandbox` attribute for security
- `onError` handler for iframe failures
- `window.open(url, '_blank')` for new tab
- Search uses Google with URL encoding
- Graceful degradation for all sites

## 🎵 Music Player ("Radiohead Lo-Fi Station")

A Winamp/WMP9-inspired music player with procedural retro noise generation:

### Features:
- **Procedural Audio Engine** - Pink noise + vinyl crackles generated via Web Audio API (no external audio files needed)
- **LCD Display** - Green-on-black display showing track name, artist, album, and time
- **Album Art** - Pixelated cover images with retro CSS filters (`contrast(1.2) saturate(0.8)`)
- **Visualizer** - 5-bar CSS equalizer bouncing during playback
- **Controls** - Play/Pause, Next/Prev, Loop toggle
- **Dual Volume Control**:
  - Music Volume (0-100%) - independent track volume
  - Atmosphere Slider (0-100%) - controls procedural noise level
- **Progress Bar** - Seekable with time display
- **Playlist** - Scrollable track list with highlighting

### Audio Engine (No External Files Required):
- **Pink Noise** - Generated via Voss-McCartney algorithm, filtered through BiquadFilterNode (lowpass @ 800Hz)
- **Vinyl Crackle** - Random short bursts of noise at irregular intervals (100-2000ms)
- **Mixing** - Separate GainNodes for music and noise, default 100% music / 12% noise

### Playlist Structure:
```typescript
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioSrc: string;  // Explicitly linked to cover
  coverSrc: string;  // Explicitly linked to audio
}
```

### Adding Real Music:
1. Place audio files in `/public/audio/` (creep.mp3, just.mp3, etc.)
2. Place cover images in `/public/covers/` (300x300px recommended)
3. Update paths in `src/data/playlist.ts`
4. The player will automatically load and display them

### Technical Details:
- `useRetroNoise` hook for procedural audio generation
- AudioContext with BiquadFilterNode for noise shaping
- Separate gain nodes for independent volume control
- CSS animations for equalizer visualization
- Fallback pixel-art icon if cover fails to load

## 🎨 Custom Pixel-Art Icons

All emoji icons have been replaced with custom pixel-art SVG icons:

### Icon Set:
- **Terminal** - Black screen with green cursor
- **Notepad** - Paper with lines and pencil
- **Paint** - Palette with paint colors
- **Browser** - Window with address bar
- **Games Folder** - Yellow folder with game controller
- **My Computer** - Monitor with stand
- **Recycle Bin** - Trash can with recycle arrows
- **Minesweeper** - Mine with flag
- **Snake** - Green snake with red food
- **Tetris** - Colorful tetromino pieces
- **Dino Runner** - Pixel dinosaur with cactus
- **Settings** - Gear icon
- **About** - Blue circle with "i"

### Technical Details:
- 16x16 or 32x32 pixel art style
- Limited Win95 color palette
- `image-rendering: pixelated` for crisp edges
- Inline SVG components (no external assets)
- Reusable `AppIcon` component for consistent rendering

## 📁 Virtual File System (VFS)

Hybrid navigation structure with desktop shortcuts and virtual folders:

### Directory Structure:
```
C:/
├── Desktop/
│   ├── Terminal
│   ├── Notepad
│   ├── Paint
│   ├── Browser
│   └── Games/ → /Programs/Games
├── Programs/
│   └── Games/
│       ├── Minesweeper
│       ├── Snake
│       ├── Tetris
│       └── Dino Runner
└── Settings/
    └── Control Panel
```

### Features:
- **Desktop Icons** - Max 6 items for clean aesthetics (4 apps + Games folder + My Computer)
- **Games Folder** - Opens FolderViewer showing all games in /Programs/Games
- **FolderViewer Component** - Win95 Explorer-style file browser with:
  - Breadcrumb navigation (C: > Programs > Games)
  - Toolbar with "Up" button
  - Address bar with clickable path segments
  - Grid view with pixel-art icons
  - Status bar showing object count
  - Single-click to select, double-click to open
- **Start Menu Integration** - Games folder + individual game shortcuts for quick access

## 🔊 Audio System

A complete sound effects system using Web Audio API:

### Features:
- **UI Sound Effects** - Click, open, close, error, startup, minimize, maximize sounds
- **Global Mute Toggle** - Button in taskbar system tray
- **Persistent Settings** - Mute state saved to localStorage
- **No Autoplay** - Sounds only play after first user interaction (browser policy compliant)
- **Web Audio API** - No external audio files needed, all sounds generated procedurally

### Sound Types:
- `click` - UI button clicks
- `open` - Window open
- `close` - Window close
- `error` - Error/alert
- `startup` - System boot
- `minimize` - Window minimize
- `maximize` - Window maximize

### Technical Details:
- Custom `useAudio` hook with AudioContext management
- Oscillator-based sound generation (sine, square, triangle, sawtooth waves)
- Automatic AudioContext initialization on first user interaction
- Volume envelope with exponential decay for natural sound

## 🖥️ Screensaver

Classic "Flying Windows" screensaver with idle detection:

### Features:
- **Idle Detection** - Activates after 120 seconds of no mouse/keyboard activity
- **Flying Windows Animation** - 8 colorful windows bouncing around the screen
- **Auto-Dismiss** - Any mouse movement or key press exits screensaver
- **Timer Reset** - Idle timer resets on any user interaction
- **GPU Accelerated** - Uses `transform: translateZ(0)` for smooth animation

### Animation Details:
- Random window positions and velocities
- Boundary collision detection with bounce physics
- Windows 95 style title bars with gradient colors
- Semi-transparent overlay effect

## 🚀 Boot Sequence

Authentic text-only BIOS boot animation (no emojis/icons):

### Visual Style:
- **Pure Text** - No images, SVGs, or emojis
- **Black Background** (#000) with white monospace font (Courier New)
- **Line-by-line Animation** - 200ms delay between each line

### Boot Content:
```
AMIBIOS (C) 1995 American Megatrends Inc.
BIOS Date 01/15/95 14:22:51 Ver: 1.02

CPU: Intel 486DX2-66
Memory Test: 640K OK

Detecting Primary Master ... [HDD 540MB]
Detecting Primary Slave  ... [None]

Loading RETRO OS v1.0...
_ (blinking cursor)
```

### Transition:
- After 3 seconds of blinking cursor, fade to Desktop
- Smooth 500ms opacity transition

### Technical Details:
- Sequential line-by-line animation with 200ms intervals
- Blinking cursor animation (CSS animate-pulse)
- Fade transition using CSS opacity
- No external assets - pure text rendering

## 🎨 Visual Polish

### Custom Pixel-Art Cursor:
- SVG-based cursor for crisp rendering at any resolution
- Different cursors for different contexts (default, pointer, text, move)
- Classic Windows 95 arrow design

### Enhanced Window Shadows:
- Multi-layer shadows for depth perception
- Stronger shadows for active/focused windows
- Inset borders for authentic 3D effect

### CRT Effects:
- Scanline overlay with adjustable opacity
- Vignette effect for screen curvature simulation
- Subtle flicker animation (toggleable)
- Performance mode for low-end devices

## 💻 Enhanced Terminal

A fully-featured terminal emulator with permanent matrix background:

### Matrix Effect:
- **Permanent Subtle Background** - Always visible at opacity 0.15
- **No Toggle Command** - Removed `matrix` command from help
- **Z-Index Layering** - Canvas at z-index: 0, text at z-index: 10
- **Readable Text** - Background rgba(0,0,0,0.85) ensures text clarity
- **Smooth Animation** - requestAnimationFrame for 60fps

### Input Bug Fix:
- **Fixed** - Typing numbers no longer triggers "Command not found"
- **Solution** - Only process input as command when Enter is pressed
- **Result** - Natural typing experience without false command errors

### Layout Improvements:
- **Padding Added** - 1rem padding to text containers
- **No Border Touch** - Text doesn't touch window borders
- **Better Readability** - More comfortable viewing experience

### Commands:
- **neofetch** - Display ASCII art laptop with system information
- **help** - List all available commands
- **clear** - Clear terminal screen
- **projects** - List portfolio projects
- **contact** - Show contact information
- **skills** - Display technical skills
- **echo [text]** - Print text to terminal
- **date** - Show current date and time
- **whoami** - Display current user
- **ls** - List directory contents
- **cat [file]** - Display file contents
- **sudo crash** - Trigger BSOD (easter egg)
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

## 🎮 Tetris Game

A fully functional Tetris implementation with classic gameplay mechanics:

### Features:
- **All 7 Tetrominoes** - I, J, L, O, S, T, Z pieces with correct rotation
- **Canvas Rendering** - Smooth 60fps gameplay with pixelated retro aesthetic
- **Gravity System** - Pieces fall automatically, speed increases with level
- **Line Clearing** - Single (100), Double (300), Triple (500), Tetris (800) points
- **Level System** - Level up every 10 lines cleared, increases drop speed
- **Next Piece Preview** - See what's coming next
- **Hold Piece** - Store a piece for later (press C)
- **Hard Drop** - Instant drop (press Space)
- **Soft Drop** - Faster fall (hold Down arrow)
- **Wall Kicks** - Smart rotation near walls
- **High Score** - Persisted to localStorage

### Controls:
- **← →** - Move piece left/right
- **↑** - Rotate piece
- **↓** - Soft drop (faster fall, +1 point per cell)
- **Space** - Hard drop (instant drop) or start/restart game
- **C** - Hold current piece
- **P** - Pause/resume game

### Scoring:
- **Single line** - 100 × (level + 1)
- **Double line** - 300 × (level + 1)
- **Triple line** - 500 × (level + 1)
- **Tetris (4 lines)** - 800 × (level + 1)
- **Soft drop** - 1 point per cell

### Technical Details:
- **Modular architecture** - Logic separated in `tetrisLogic.ts`
- **Type-safe** - Full TypeScript with strict mode
- **Canvas rendering** - 10x20 grid with 28px cells
- **Delta-time game loop** - Consistent speed across devices
- **SRS-like rotation** - Wall kicks for better gameplay
- **Auto-pause** - Pauses when window loses focus

## 🐍 Snake Game

A classic Snake game implementation with smooth 60fps gameplay:

### Features:
- **HTML5 Canvas Rendering** - Smooth 60fps gameplay using requestAnimationFrame
- **Delta-time Game Loop** - Consistent speed across different devices
- **Classic Controls** - Arrow keys to move, P to pause, Space to start/restart
- **Collision Detection** - Wall collision and self-collision end the game
- **Score System** - Track current score and high score (persisted to localStorage)
- **Progressive Difficulty** - Snake speeds up as you eat more food
- **Win95 Aesthetic** - Green snake, red food, black background with pixelated rendering

### Controls:
- **Arrow Keys** - Move snake (Up/Down/Left/Right)
- **P** - Pause/Resume game
- **Space** - Start new game / Restart after game over

### Game States:
- **Idle** - Initial state, press Space to start
- **Playing** - Active gameplay
- **Paused** - Game paused (press P to resume)
- **Game Over** - Collision detected, press Space to restart

### Technical Details:
- Grid-based movement (20x20 grid)
- useRef for game state to avoid re-renders
- requestAnimationFrame with delta-time calculation
- Prevents 180° turns (can't reverse into self)
- Food spawns only on empty cells
- ARIA live region announces score changes
- Keyboard-only accessible

## 🦖 Dino Runner Game

An infinite runner game inspired by Chrome's Dino game:

### Features:
- **Canvas Rendering** - Smooth 60fps gameplay with pixel art aesthetic
- **Procedural Graphics** - All sprites drawn programmatically (no external images)
- **Jump Physics** - Realistic gravity and jumping mechanics
- **Ducking** - Reduces hitbox to dodge flying obstacles
- **Fast Fall** - Jump while ducking for quick descent
- **Obstacles** - Cacti (small/large/groups) and pterodactyls at different heights
- **Day/Night Cycle** - Color inversion every 700 points with smooth transition
- **Clouds** - Decorative elements for atmosphere
- **Progressive Difficulty** - Speed increases over time
- **Score System** - Distance-based scoring
- **High Score** - Persisted to localStorage

### Controls:
- **Space/↑** - Jump (or start/restart)
- **↓** - Duck
- **Space while ducking** - Fast fall

### Mechanics:
- Automatic speed increase
- Random obstacle generation
- Pterodactyls at varying heights
- Smooth day/night transition
- Running animation for dino
- Wing animation for pterodactyls

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
