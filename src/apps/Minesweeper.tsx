import React, { useCallback, useMemo } from 'react';
import { useMinesweeper, Cell, GameStatus } from '../hooks/useMinesweeper';

interface MinesweeperProps {
  windowId?: string;
}

// Компонент ячейки с React.memo для оптимизации
const MineCell = React.memo<{
  cell: Cell;
  gameStatus: GameStatus;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}>(({ cell, gameStatus, onReveal, onFlag }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'won' && gameStatus !== 'lost') {
      onReveal(cell.row, cell.col);
    }
  }, [cell.row, cell.col, gameStatus, onReveal]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'won' && gameStatus !== 'lost') {
      onFlag(cell.row, cell.col);
    }
  }, [cell.row, cell.col, gameStatus, onFlag]);

  const getCellContent = () => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines === 0) return '';
    return cell.adjacentMines.toString();
  };

  const getCellColor = () => {
    if (!cell.isRevealed || cell.adjacentMines === 0) return '';
    const colors = [
      '', // 0
      'text-blue-600', // 1
      'text-green-600', // 2
      'text-red-600', // 3
      'text-purple-600', // 4
      'text-red-800', // 5
      'text-teal-600', // 6
      'text-black', // 7
      'text-gray-600', // 8
    ];
    return colors[cell.adjacentMines] || '';
  };

  const getCellStyle = () => {
    if (cell.isRevealed) {
      return {
        boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
        background: '#c0c0c0',
      };
    }
    return {
      boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
      background: '#c0c0c0',
    };
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className="w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-400 cursor-pointer select-none"
      style={getCellStyle()}
      aria-label={`Cell ${cell.row},${cell.col}${cell.isFlagged ? ' flagged' : ''}${cell.isRevealed ? ' revealed' : ''}`}
      tabIndex={0}
    >
      <span className={getCellColor()}>{getCellContent()}</span>
    </button>
  );
});

MineCell.displayName = 'MineCell';

// Главный компонент Minesweeper
export default function Minesweeper({ windowId }: MinesweeperProps) {
  const ROWS = 10;
  const COLS = 10;
  const MINES = 15;

  const {
    board,
    gameStatus,
    flagsRemaining,
    timeElapsed,
    revealCell,
    toggleFlag,
    resetGame,
  } = useMinesweeper(ROWS, COLS, MINES);

  const getStatusEmoji = () => {
    switch (gameStatus) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      default:
        return '🙂';
    }
  };

  const formatTime = (seconds: number) => {
    return Math.min(999, seconds).toString().padStart(3, '0');
  };

  const formatFlags = (flags: number) => {
    return Math.max(-99, Math.min(999, flags)).toString().padStart(3, '0');
  };

  // Мемоизация рендера доски
  const renderedBoard = useMemo(() => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <MineCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            gameStatus={gameStatus}
            onReveal={revealCell}
            onFlag={toggleFlag}
          />
        ))}
      </div>
    ));
  }, [board, gameStatus, revealCell, toggleFlag]);

  return (
    <article
      className="h-full w-full flex flex-col bg-gray-200 p-2"
      role="main"
      aria-label="Minesweeper game"
    >
      {/* Верхняя панель с информацией */}
      <div
        className="flex items-center justify-between p-2 mb-2 border-2"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          background: '#c0c0c0',
        }}
      >
        {/* Счётчик флагов */}
        <div
          className="px-2 py-1 font-mono text-xl font-bold text-red-600 bg-black min-w-[60px] text-center"
          aria-label={`Flags remaining: ${flagsRemaining}`}
        >
          {formatFlags(flagsRemaining)}
        </div>

        {/* Кнопка сброса */}
        <button
          onClick={resetGame}
          className="w-10 h-10 flex items-center justify-center text-2xl border-2 cursor-pointer active:border-gray-600"
          style={{
            boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
            background: '#c0c0c0',
          }}
          aria-label="Reset game"
          title="New Game"
        >
          {getStatusEmoji()}
        </button>

        {/* Таймер */}
        <div
          className="px-2 py-1 font-mono text-xl font-bold text-red-600 bg-black min-w-[60px] text-center"
          aria-label={`Time elapsed: ${timeElapsed} seconds`}
        >
          {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Игровое поле */}
      <div
        className="flex-1 flex items-center justify-center border-2 overflow-auto"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          background: '#c0c0c0',
        }}
      >
        <div className="inline-block">
          {renderedBoard}
        </div>
      </div>

      {/* Сообщение о статусе игры */}
      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <div
          className="mt-2 p-2 text-center font-bold border-2"
          style={{
            boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
            background: gameStatus === 'won' ? '#90EE90' : '#FFB6C1',
          }}
          role="alert"
          aria-live="polite"
        >
          {gameStatus === 'won' ? '🎉 You Win!' : '💥 Game Over!'}
        </div>
      )}

      {/* Инструкции */}
      <div className="mt-2 text-xs text-gray-600 text-center">
        <p>Left click: Reveal | Right click: Flag</p>
      </div>
    </article>
  );
}
