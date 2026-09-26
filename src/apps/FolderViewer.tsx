import React, { useState, useCallback } from 'react';
import { getFolderContents, getNodeByPath, buildBreadcrumb, getParentPath, VFSNode } from '../apps/vfs';
import { useWindowStore } from '../store/windowStore';
import { appRegistry } from '../apps/registry';
import AppIcon from '../components/icons/AppIcon';

interface FolderViewerProps {
  path: string;
  windowId?: string;
}

export default function FolderViewer({ path, windowId }: FolderViewerProps) {
  const [currentPath, setCurrentPath] = useState(path);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const openWindow = useWindowStore(s => s.openWindow);

  const contents = getFolderContents(currentPath);
  const breadcrumb = buildBreadcrumb(currentPath);

  // Навигация вверх
  const handleNavigateUp = useCallback(() => {
    const parentPath = getParentPath(currentPath);
    setCurrentPath(parentPath);
    setSelectedItem(null);
  }, [currentPath]);

  // Навигация по breadcrumb
  const handleBreadcrumbClick = useCallback((path: string) => {
    setCurrentPath(path);
    setSelectedItem(null);
  }, []);

  // Обработка двойного клика
  const handleDoubleClick = useCallback((item: VFSNode) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path);
      setSelectedItem(null);
    } else if (item.type === 'file' && item.appId) {
      const app = appRegistry.find(a => a.id === item.appId);
      if (app) {
        openWindow(app.id, app.title, app.id, app.defaultSize);
      }
    }
  }, [openWindow]);

  // Обработка одинарного клика
  const handleClick = useCallback((item: VFSNode) => {
    setSelectedItem(item.path);
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div 
        className="flex items-center gap-2 p-2 border-b-2 border-gray-400 bg-gray-200"
        style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
      >
        <button
          onClick={handleNavigateUp}
          disabled={currentPath === '/'}
          className="px-3 py-1 text-xs border-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
          aria-label="Go up one level"
        >
          <span>⬆️</span>
          <span>Up</span>
        </button>
      </div>

      {/* Address Bar */}
      <div 
        className="flex items-center gap-2 p-2 border-b-2 border-gray-400 bg-gray-200"
        style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
      >
        <span className="text-xs font-bold">Address:</span>
        <div 
          className="flex-1 flex items-center gap-1 px-2 py-1 bg-white border-2 border-gray-400 text-xs overflow-x-auto"
          style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff' }}
        >
          {breadcrumb.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <button
                onClick={() => handleBreadcrumbClick(crumb.path)}
                className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap"
              >
                {crumb.name}
              </button>
              {index < breadcrumb.length - 1 && <span className="text-gray-500">{'>'}</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 bg-white">
        {contents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            This folder is empty
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {contents.map((item) => (
              <div
                key={item.path}
                className={`flex flex-col items-center p-2 cursor-pointer select-none ${
                  selectedItem === item.path ? 'bg-blue-100 border-2 border-blue-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleClick(item)}
                onDoubleClick={() => handleDoubleClick(item)}
                role="button"
                tabIndex={0}
                aria-label={`${item.type === 'folder' ? 'Folder' : 'File'}: ${item.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDoubleClick(item);
                  }
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center mb-1">
                  <AppIcon name={item.icon || 'folder'} size={32} />
                </div>
                <div className="text-xs text-center break-words w-full">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div 
        className="flex items-center justify-between p-2 border-t-2 border-gray-400 bg-gray-200 text-xs"
        style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
      >
        <span>{contents.length} object(s)</span>
        {selectedItem && (
          <span>Selected: {contents.find(c => c.path === selectedItem)?.name}</span>
        )}
      </div>
    </div>
  );
}
