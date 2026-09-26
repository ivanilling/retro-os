import React from 'react';
import FolderViewer from './FolderViewer';
import { getGamesPath } from './vfs';

// Обёртка для открытия папки Games
export default function GamesFolder() {
  return <FolderViewer path={getGamesPath()} />;
}
