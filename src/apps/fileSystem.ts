export interface FileSystemNode {
  type: 'file' | 'folder';
  name: string;
  path: string;
  icon?: string;
  appId?: string;
  children?: FileSystemNode[];
}

// Виртуальная файловая система
export const fileSystem: FileSystemNode = {
  type: 'folder',
  name: 'C:',
  path: '/',
  children: [
    {
      type: 'folder',
      name: 'Desktop',
      path: '/Desktop',
      children: [
        {
          type: 'file',
          name: 'Terminal',
          path: '/Desktop/Terminal',
          icon: '💻',
          appId: 'terminal',
        },
        {
          type: 'file',
          name: 'Notepad',
          path: '/Desktop/Notepad',
          icon: '📝',
          appId: 'notepad',
        },
        {
          type: 'file',
          name: 'Paint',
          path: '/Desktop/Paint',
          icon: '🎨',
          appId: 'paint',
        },
        {
          type: 'file',
          name: 'Browser',
          path: '/Desktop/Browser',
          icon: '🌐',
          appId: 'browser',
        },
        {
          type: 'file',
          name: 'My Computer',
          path: '/Desktop/My Computer',
          icon: '🖥️',
          appId: 'about',
        },
        {
          type: 'folder',
          name: 'Games',
          path: '/Desktop/Games',
          icon: '🎮',
          children: [], // Ссылка на /Program Files/Games
        },
      ],
    },
    {
      type: 'folder',
      name: 'Program Files',
      path: '/Program Files',
      children: [
        {
          type: 'folder',
          name: 'Games',
          path: '/Program Files/Games',
          icon: '🎮',
          children: [
            {
              type: 'file',
              name: 'Minesweeper',
              path: '/Program Files/Games/Minesweeper',
              icon: '💣',
              appId: 'minesweeper',
            },
            {
              type: 'file',
              name: 'Snake',
              path: '/Program Files/Games/Snake',
              icon: '🐍',
              appId: 'snake',
            },
            {
              type: 'file',
              name: 'Tetris',
              path: '/Program Files/Games/Tetris',
              icon: '🎮',
              appId: 'tetris',
            },
            {
              type: 'file',
              name: 'Dino Runner',
              path: '/Program Files/Games/Dino Runner',
              icon: '🦖',
              appId: 'dino',
            },
          ],
        },
        {
          type: 'folder',
          name: 'Accessories',
          path: '/Program Files/Accessories',
          icon: '📁',
          children: [
            {
              type: 'file',
              name: 'Calculator',
              path: '/Program Files/Accessories/Calculator',
              icon: '🧮',
              appId: 'about', // Placeholder
            },
          ],
        },
      ],
    },
    {
      type: 'folder',
      name: 'Settings',
      path: '/Settings',
      children: [
        {
          type: 'file',
          name: 'Control Panel',
          path: '/Settings/Control Panel',
          icon: '⚙️',
          appId: 'settings',
        },
      ],
    },
  ],
};

// Получить узел по пути
export function getNodeByPath(path: string): FileSystemNode | null {
  if (path === '/') return fileSystem;

  const parts = path.split('/').filter(p => p);
  let current: FileSystemNode | undefined = fileSystem;

  for (const part of parts) {
    if (!current?.children) return null;
    current = current.children.find(child => child.name === part);
    if (!current) return null;
  }

  return current || null;
}

// Получить содержимое папки
export function getFolderContents(path: string): FileSystemNode[] {
  const node = getNodeByPath(path);
  if (!node || node.type !== 'folder') return [];
  return node.children || [];
}

// Получить путь к папке Games
export function getGamesPath(): string {
  return '/Program Files/Games';
}

// Получить все приложения (рекурсивно)
export function getAllApps(): FileSystemNode[] {
  const apps: FileSystemNode[] = [];

  function traverse(node: FileSystemNode) {
    if (node.type === 'file' && node.appId) {
      apps.push(node);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(fileSystem);
  return apps;
}

// Получить приложение по appId
export function getAppByAppId(appId: string): FileSystemNode | null {
  const apps = getAllApps();
  return apps.find(app => app.appId === appId) || null;
}
