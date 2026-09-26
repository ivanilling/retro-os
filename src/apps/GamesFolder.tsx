import React from 'react';
import FolderViewer from './FolderViewer';
import { getGamesPath } from './fileSystem';

// Обёртка для открытия папки Games
export default function GamesFolder() {
  return <FolderViewer path={getGamesPath()} />;
}
