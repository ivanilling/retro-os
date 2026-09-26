import { useState, useCallback, useEffect, useRef } from 'react';

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

interface UseMinesweeperReturn {
  board: Cell[][];
  gameStatus: GameStatus;
  flagsRemaining: number;
  timeElapsed: number;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
}

export function useMinesweeper(
  rows: number,
  cols: number,
  mines: number
): UseMinesweeperReturn {
  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard(rows, cols));
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [flagsRemaining, setFlagsRemaining] = useState(mines);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const minesPlacedRef = useRef(false);

  // Создание пустой доски
  function createEmptyBoard(rows: number, cols: number): Cell[][] {
    return Array(rows)
      .fill(null)
      .map((_, row) =>
        Array(cols)
          .fill(null)
          .map((_, col) => ({
            row,
            col,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          }))
      );
  }

  // Размещение мин (после первого клика)
  function placeMines(
    board: Cell[][],
    mines: number,
    firstRow: number,
    firstCol: number
  ): Cell[][] {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);

      // Не размещаем мину на первой ячейке и вокруг неё
      if (
        !newBoard[row][col].isMine &&
        !(Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1)
      ) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Подсчёт соседних мин
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          newBoard[r][c].adjacentMines = countAdjacentMines(newBoard, r, c);
        }
      }
    }

    return newBoard;
  }

  // Подсчёт соседних мин
  function countAdjacentMines(board: Cell[][], row: number, col: number): number {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          if (board[newRow][newCol].isMine) count++;
        }
      }
    }
    return count;
  }

  // Открытие ячейки
  const revealCell = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') return;

      setBoard(prevBoard => {
        const cell = prevBoard[row][col];
        if (cell.isRevealed || cell.isFlagged) return prevBoard;

        let newBoard = prevBoard.map(r => r.map(c => ({ ...c })));

        // Первый клик - размещаем мины
        if (gameStatus === 'idle') {
          newBoard = placeMines(newBoard, mines, row, col);
          setGameStatus('playing');
          startTimer();
        }

        // Проверка на мину
        if (newBoard[row][col].isMine) {
          // Игра проиграна - открываем все мины
          newBoard = newBoard.map(r =>
            r.map(c => ({
              ...c,
              isRevealed: c.isMine ? true : c.isRevealed,
            }))
          );
          setGameStatus('lost');
          stopTimer();
          return newBoard;
        }

        // Открытие ячейки с flood fill
        floodFill(newBoard, row, col);

        // Проверка победы
        const unrevealedSafeCells = newBoard.flat().filter(c => !c.isRevealed && !c.isMine).length;
        if (unrevealedSafeCells === 0) {
          setGameStatus('won');
          stopTimer();
        }

        return newBoard;
      });
    },
    [gameStatus, mines, rows, cols]
  );

  // Flood fill для открытия пустых ячеек
  function floodFill(board: Cell[][], row: number, col: number) {
    const queue: [number, number][] = [[row, col]];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const cell = board[r][c];

      if (cell.isRevealed || cell.isFlagged || cell.isMine) continue;

      board[r][c].isRevealed = true;

      // Если ячейка пустая, добавляем соседей в очередь
      if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = r + dr;
            const newCol = c + dc;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              queue.push([newRow, newCol]);
            }
          }
        }
      }
    }
  }

  // Переключение флага
  const toggleFlag = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') return;

      setBoard(prevBoard => {
        const cell = prevBoard[row][col];
        if (cell.isRevealed) return prevBoard;

        const newBoard = prevBoard.map(r => r.map(c => ({ ...c })));
        newBoard[row][col].isFlagged = !cell.isFlagged;

        setFlagsRemaining(prev => (cell.isFlagged ? prev + 1 : prev - 1));

        return newBoard;
      });
    },
    [gameStatus]
  );

  // Сброс игры
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard(rows, cols));
    setGameStatus('idle');
    setFlagsRemaining(mines);
    setTimeElapsed(0);
    stopTimer();
    minesPlacedRef.current = false;
  }, [rows, cols, mines]);

  // Таймер
  function startTimer() {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  return {
    board,
    gameStatus,
    flagsRemaining,
    timeElapsed,
    revealCell,
    toggleFlag,
    resetGame,
  };
}
