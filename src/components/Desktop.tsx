import React, { useCallback, useState } from 'react';
import { useWindowStore } from '../store/windowStore';
import { getFolderContents } from '../apps/vfs';
import { appRegistry } from '../apps/registry';
import DesktopIcon from './DesktopIcon';
import AppIcon from './icons/AppIcon';
import ContextMenu from './ContextMenu';

// Иконки на рабочем столе из VFS
const desktopContents = getFolderContents('/Desktop');

export default function Desktop() {
  const openWindow = useWindowStore(s => s.openWindow);
  const closeStartMenu = useWindowStore(s => s.closeStartMenu);
  const selectedIconId = useWindowStore(s => s.selectedIconId);
  const setSelectedIcon = useWindowStore(s => s.setSelectedIcon);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeStartMenu();
      setSelectedIcon(null);
      setContextMenu(null);
    }
  }, [closeStartMenu, setSelectedIcon]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleIconDoubleClick = useCallback((item: any) => {
    if (item.appId) {
      if (item.appId === 'games-folder') {
        // Открываем папку Games
        openWindow('games-folder', 'Games', 'games-folder', { w: 600, h: 450 });
      } else {
        // Открываем приложение
        const app = appRegistry.find((a: any) => a.id === item.appId);
        if (app) {
          openWindow(app.id, app.title, app.id, app.defaultSize);
        }
      }
    }
  }, [openWindow]);

  return (
    <main
      className="absolute inset-0 bottom-10 overflow-hidden desktop-area"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      role="application"
      aria-label="Desktop"
      style={{
        background: 'linear-gradient(135deg, #008080 0%, #006666 50%, #004d4d 100%)',
      }}
    >
      {/* Иконки на рабочем столе из VFS */}
      <div key={refreshKey}>
        {desktopContents.map((item, index) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon || 'folder'}
            label={item.name}
            appId={item.id}
            isSelected={selectedIconId === item.id}
            defaultX={20}
            defaultY={20 + index * 90}
            onDoubleClick={() => handleIconDoubleClick(item)}
          />
        ))}
      </div>

      {/* Дополнительные иконки (My Computer, Recycle Bin) */}
      <DesktopIcon
        icon="my-computer"
        label="My Computer"
        appId="my-computer"
        isSelected={selectedIconId === 'my-computer'}
        defaultX={20}
        defaultY={20 + desktopContents.length * 90}
        onDoubleClick={() => openWindow('about', 'About', 'about', { w: 450, h: 500 })}
      />
      <DesktopIcon
        icon="recycle-bin"
        label="Recycle Bin"
        appId="recycle-bin"
        isSelected={selectedIconId === 'recycle-bin'}
        defaultX={20}
        defaultY={20 + (desktopContents.length + 1) * 90}
        onDoubleClick={() => {}}
      />

      {/* SEO контент */}
      <div className="sr-only" aria-hidden="false">
        <h1>Alex Chen - Full Stack Developer Portfolio</h1>
        <p>Full-stack developer with 5+ years of experience building modern web applications.</p>
        <section>
          <h2>Projects</h2>
          <ul>
            <li>Retro OS Portfolio - A Windows 95-inspired portfolio website</li>
            <li>Cloud Dashboard - Real-time monitoring dashboard</li>
            <li>AI Chat Platform - GPT-powered chat application</li>
            <li>E-Commerce Engine - Headless commerce solution</li>
            <li>Open Source UI Library - React component library</li>
          </ul>
        </section>
        <section>
          <h2>Skills</h2>
          <p>TypeScript, JavaScript, Python, Rust, React, Vue, Svelte, Tailwind CSS, Node.js, Express, FastAPI, Go, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>Email: alex@example.com | GitHub: github.com/alexchen | LinkedIn: linkedin.com/in/alexchen</p>
        </section>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onRefresh={() => setRefreshKey(prev => prev + 1)}
          onChangeWallpaper={() => {
            // TODO: Implement wallpaper changer
            alert('Wallpaper changer coming soon!');
          }}
          onProperties={() => openWindow('settings', 'Settings', 'settings', { w: 400, h: 450 })}
          onNewFolder={() => {
            // TODO: Implement new folder creation
            alert('New folder creation coming soon!');
          }}
        />
      )}
    </main>
  );
}
