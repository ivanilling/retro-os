export type NodeType = 'file' | 'folder';

export interface VFSNode {
  id: string;
  name: string;
  type: NodeType;
  path: string;
  icon?: string;
  appId?: string;
  children?: VFSNode[];
}

// Виртуальная файловая система
export const vfs: VFSNode = {
  id: 'root',
  name: 'C:',
  type: 'folder',
  path: '/',
  children: [
    {
      id: 'desktop',
      name: 'Desktop',
      type: 'folder',
      path: '/Desktop',
      children: [
        {
          id: 'terminal',
          name: 'Terminal',
          type: 'file',
          path: '/Desktop/Terminal',
          icon: 'terminal',
          appId: 'terminal',
        },
        {
          id: 'notepad',
          name: 'Notepad',
          type: 'file',
          path: '/Desktop/Notepad',
          icon: 'notepad',
          appId: 'notepad',
        },
        {
          id: 'paint',
          name: 'Paint',
          type: 'file',
          path: '/Desktop/Paint',
          icon: 'paint',
          appId: 'paint',
        },
        {
          id: 'browser',
          name: 'Browser',
          type: 'file',
          path: '/Desktop/Browser',
          icon: 'browser',
          appId: 'browser',
        },
        {
          id: 'music-player',
          name: 'Music Player',
          type: 'file',
          path: '/Desktop/Music Player',
          icon: 'music-player',
          appId: 'music-player',
        },
        {
          id: 'games-folder',
          name: 'Games',
          type: 'folder',
          path: '/Desktop/Games',
          icon: 'games-folder',
          appId: 'games-folder',
        },
      ],
    },
    {
      id: 'programs',
      name: 'Programs',
      type: 'folder',
      path: '/Programs',
      children: [
        {
          id: 'games',
          name: 'Games',
          type: 'folder',
          path: '/Programs/Games',
          icon: 'games-folder',
          children: [
            {
              id: 'minesweeper',
              name: 'Minesweeper',
              type: 'file',
              path: '/Programs/Games/Minesweeper',
              icon: 'minesweeper',
              appId: 'minesweeper',
            },
            {
              id: 'snake',
              name: 'Snake',
              type: 'file',
              path: '/Programs/Games/Snake',
              icon: 'snake',
              appId: 'snake',
            },
            {
              id: 'tetris',
              name: 'Tetris',
              type: 'file',
              path: '/Programs/Games/Tetris',
              icon: 'tetris',
              appId: 'tetris',
            },
            {
              id: 'dino',
              name: 'Dino Runner',
              type: 'file',
              path: '/Programs/Games/Dino Runner',
              icon: 'dino',
              appId: 'dino',
            },
          ],
        },
      ],
    },
  ],
};

// Получить узел по пути
export function getNodeByPath(path: string): VFSNode | null {
  if (path === '/') return vfs;
  
  const parts = path.split('/').filter(p => p);
  let current: VFSNode | undefined = vfs;
  
  for (const part of parts) {
    if (!current?.children) return null;
    current = current.children.find(child => child.name === part);
    if (!current) return null;
  }
  
  return current || null;
}

// Получить содержимое папки
export function getFolderContents(path: string): VFSNode[] {
  const node = getNodeByPath(path);
  if (!node || node.type !== 'folder') return [];
  return node.children || [];
}

// Получить путь к папке Games
export function getGamesPath(): string {
  return '/Programs/Games';
}

// Получить все приложения
export function getAllApps(): VFSNode[] {
  const apps: VFSNode[] = [];
  
  function traverse(node: VFSNode) {
    if (node.type === 'file' && node.appId) {
      apps.push(node);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(vfs);
  return apps;
}

// Получить приложение по appId
export function getAppByAppId(appId: string): VFSNode | null {
  const apps = getAllApps();
  return apps.find(app => app.appId === appId) || null;
}

// Получить родительский путь
export function getParentPath(path: string): string {
  const parts = path.split('/').filter(p => p);
  if (parts.length === 0) return '/';
  parts.pop();
  return '/' + parts.join('/');
}

// Построить breadcrumb
export function buildBreadcrumb(path: string): Array<{ name: string; path: string }> {
  const crumbs = [{ name: 'C:', path: '/' }];
  
  if (path === '/') return crumbs;
  
  const parts = path.split('/').filter(p => p);
  let currentPath = '';
  
  for (const part of parts) {
    currentPath += '/' + part;
    crumbs.push({ name: part, path: currentPath });
  }
  
  return crumbs;
}
