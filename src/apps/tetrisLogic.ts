// Типы
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  position: Position;
}

export interface GameState {
  board: (TetrominoType | null)[][];
  currentPiece: Tetromino | null;
  nextPiece: TetrominoType;
  holdPiece: TetrominoType | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameover';
}

// Константы
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const INITIAL_DROP_SPEED = 1000; // ms
export const SPEED_INCREMENT = 50; // ms per level
export const LINES_PER_LEVEL = 10;

// Очки за очистку линий
export const SCORE_TABLE = {
  1: 100,  // single
  2: 300,  // double
  3: 500,  // triple
  4: 800,  // tetris
};

// Цвета тетромино
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00ffff', // cyan
  J: '#0000ff', // blue
  L: '#ffa500', // orange
  O: '#ffff00', // yellow
  S: '#00ff00', // green
  T: '#800080', // purple
  Z: '#ff0000', // red
};

// Формы тетромино
const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// Создание пустой доски
export function createEmptyBoard(): (TetrominoType | null)[][] {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));
}

// Генерация случайного тетромино
export function generateRandomPiece(): TetrominoType {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  return types[Math.floor(Math.random() * types.length)];
}

// Создание тетромино
export function createTetromino(type: TetrominoType): Tetromino {
  return {
    type,
    shape: TETROMINO_SHAPES[type].map(row => [...row]),
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
  };
}

// Проверка коллизии
export function checkCollision(
  board: (TetrominoType | null)[][],
  piece: Tetromino,
  offsetX = 0,
  offsetY = 0
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;

        // Проверка границ
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        // Проверка коллизии с доской (если не выше верха)
        if (newY >= 0 && board[newY][newX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

// Ротация матрицы по часовой стрелке
export function rotateMatrix(matrix: number[][]): number[][] {
  const N = matrix.length;
  const rotated = matrix.map((row, i) =>
    row.map((_, j) => matrix[N - 1 - j][i])
  );
  return rotated;
}

// Попытка ротации с wall kick
export function tryRotate(
  board: (TetrominoType | null)[][],
  piece: Tetromino
): Tetromino | null {
  const rotatedShape = rotateMatrix(piece.shape);
  const rotatedPiece = { ...piece, shape: rotatedShape };

  // Проверяем базовую ротацию
  if (!checkCollision(board, rotatedPiece)) {
    return rotatedPiece;
  }

  // Wall kicks (простая реализация)
  const kicks = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: -1 },
  ];

  for (const kick of kicks) {
    const kickedPiece = {
      ...rotatedPiece,
      position: {
        x: rotatedPiece.position.x + kick.x,
        y: rotatedPiece.position.y + kick.y,
      },
    };

    if (!checkCollision(board, kickedPiece)) {
      return kickedPiece;
    }
  }

  return null;
}

// Закрепление фигуры на доске
export function lockPiece(
  board: (TetrominoType | null)[][],
  piece: Tetromino
): (TetrominoType | null)[][] {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    }
  }

  return newBoard;
}

// Очистка заполненных линий
export function clearLines(board: (TetrominoType | null)[][]): {
  newBoard: (TetrominoType | null)[][];
  linesCleared: number;
} {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  // Добавляем пустые линии сверху
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared };
}

// Расчёт очков
export function calculateScore(linesCleared: number, level: number): number {
  const baseScore = SCORE_TABLE[linesCleared as keyof typeof SCORE_TABLE] || 0;
  return baseScore * (level + 1);
}

// Расчёт скорости падения
export function calculateDropSpeed(level: number): number {
  return Math.max(100, INITIAL_DROP_SPEED - level * SPEED_INCREMENT);
}

// Hard drop
export function hardDrop(
  board: (TetrominoType | null)[][],
  piece: Tetromino
): Tetromino {
  let droppedPiece = { ...piece };
  while (!checkCollision(board, droppedPiece, 0, 1)) {
    droppedPiece = {
      ...droppedPiece,
      position: { ...droppedPiece.position, y: droppedPiece.position.y + 1 },
    };
  }
  return droppedPiece;
}

// Создание начального состояния игры
export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: generateRandomPiece(),
    holdPiece: null,
    canHold: true,
    score: 0,
    level: 0,
    lines: 0,
    gameStatus: 'idle',
  };
}
