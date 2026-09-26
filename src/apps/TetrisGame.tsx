import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  TetrominoType,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_COLORS,
  createInitialGameState,
  createTetromino,
  generateRandomPiece,
  checkCollision,
  tryRotate,
  lockPiece,
  clearLines,
  calculateScore,
  calculateDropSpeed,
  hardDrop,
} from './tetrisLogic';

interface TetrisGameProps {
  windowId?: string;
}

const CELL_SIZE = 28;
const BOARD_PIXEL_WIDTH = BOARD_WIDTH * CELL_SIZE;
const BOARD_PIXEL_HEIGHT = BOARD_HEIGHT * CELL_SIZE;

export default function TetrisGame({ windowId }: TetrisGameProps) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('tetris-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastDropRef = useRef<number>(0);

  // Рендеринг на canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем сетку
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, BOARD_PIXEL_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(BOARD_PIXEL_WIDTH, y * CELL_SIZE);
      ctx.stroke();
    }

    // Рисуем доску
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = gameState.board[y][x];
        if (cell) {
          drawCell(ctx, x, y, TETROMINO_COLORS[cell]);
        }
      }
    }

    // Рисуем текущую фигуру
    if (gameState.currentPiece) {
      const { shape, position, type } = gameState.currentPiece;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            drawCell(ctx, position.x + x, position.y + y, TETROMINO_COLORS[type]);
          }
        }
      }
    }
  }, [gameState]);

  // Отрисовка ячейки
  const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    const pixelX = x * CELL_SIZE;
    const pixelY = y * CELL_SIZE;

    // Основной цвет
    ctx.fillStyle = color;
    ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);

    // Светлая грань (верх, лево)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(pixelX, pixelY, CELL_SIZE, 3);
    ctx.fillRect(pixelX, pixelY, 3, CELL_SIZE);

    // Тёмная грань (низ, право)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(pixelX, pixelY + CELL_SIZE - 3, CELL_SIZE, 3);
    ctx.fillRect(pixelX + CELL_SIZE - 3, pixelY, 3, CELL_SIZE);
  };

  // Игровой цикл
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState.gameStatus !== 'playing') return;

    const dropSpeed = calculateDropSpeed(gameState.level);
    const deltaTime = timestamp - lastDropRef.current;

    if (deltaTime >= dropSpeed) {
      // Двигаем фигуру вниз
      setGameState(prev => {
        if (!prev.currentPiece) return prev;

        const movedPiece = {
          ...prev.currentPiece,
          position: {
            ...prev.currentPiece.position,
            y: prev.currentPiece.position.y + 1,
          },
        };

        if (checkCollision(prev.board, movedPiece)) {
          // Закрепляем фигуру
          const newBoard = lockPiece(prev.board, prev.currentPiece);
          const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
          const scoreGain = calculateScore(linesCleared, prev.level);
          const newLines = prev.lines + linesCleared;
          const newLevel = Math.floor(newLines / 10);

          // Создаём новую фигуру
          const newPiece = createTetromino(prev.nextPiece);
          const nextPiece = generateRandomPiece();

          // Проверка game over
          if (checkCollision(clearedBoard, newPiece)) {
            // Сохраняем рекорд
            if (prev.score + scoreGain > highScore) {
              setHighScore(prev.score + scoreGain);
              localStorage.setItem('tetris-highscore', (prev.score + scoreGain).toString());
            }

            return {
              ...prev,
              board: clearedBoard,
              currentPiece: null,
              score: prev.score + scoreGain,
              lines: newLines,
              level: newLevel,
              gameStatus: 'gameover',
            };
          }

          return {
            ...prev,
            board: clearedBoard,
            currentPiece: newPiece,
            nextPiece,
            score: prev.score + scoreGain,
            lines: newLines,
            level: newLevel,
            canHold: true,
          };
        }

        return {
          ...prev,
          currentPiece: movedPiece,
        };
      });

      lastDropRef.current = timestamp;
    }

    render();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameStatus, gameState.level, highScore, render]);

  // Запуск/остановка игрового цикла
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      lastDropRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameStatus, gameLoop]);

  // Начальная отрисовка
  useEffect(() => {
    render();
  }, [render]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      // Space - старт/рестарт или hard drop
      if (e.code === 'Space') {
        if (gameState.gameStatus === 'idle' || gameState.gameStatus === 'gameover') {
          startGame();
        } else if (gameState.gameStatus === 'playing' && gameState.currentPiece) {
          // Hard drop
          setGameState(prev => {
            if (!prev.currentPiece) return prev;
            const droppedPiece = hardDrop(prev.board, prev.currentPiece);
            return {
              ...prev,
              currentPiece: droppedPiece,
            };
          });
        }
        return;
      }

      // P - пауза
      if (e.code === 'KeyP') {
        if (gameState.gameStatus === 'playing') {
          setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
        } else if (gameState.gameStatus === 'paused') {
          setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
        }
        return;
      }

      // C - hold piece
      if (e.code === 'KeyC' && gameState.canHold && gameState.currentPiece) {
        setGameState(prev => {
          if (!prev.currentPiece || !prev.canHold) return prev;

          const currentType = prev.currentPiece.type;
          const newPiece = prev.holdPiece
            ? createTetromino(prev.holdPiece)
            : createTetromino(prev.nextPiece);

          const nextPiece = prev.holdPiece ? prev.nextPiece : generateRandomPiece();

          return {
            ...prev,
            currentPiece: newPiece,
            holdPiece: currentType,
            nextPiece,
            canHold: false,
          };
        });
        return;
      }

      if (gameState.gameStatus !== 'playing' || !gameState.currentPiece) return;

      // Стрелки
      setGameState(prev => {
        if (!prev.currentPiece) return prev;

        switch (e.code) {
          case 'ArrowLeft': {
            const movedPiece = {
              ...prev.currentPiece,
              position: { ...prev.currentPiece.position, x: prev.currentPiece.position.x - 1 },
            };
            if (!checkCollision(prev.board, movedPiece)) {
              return { ...prev, currentPiece: movedPiece };
            }
            break;
          }
          case 'ArrowRight': {
            const movedPiece = {
              ...prev.currentPiece,
              position: { ...prev.currentPiece.position, x: prev.currentPiece.position.x + 1 },
            };
            if (!checkCollision(prev.board, movedPiece)) {
              return { ...prev, currentPiece: movedPiece };
            }
            break;
          }
          case 'ArrowDown': {
            // Soft drop
            const movedPiece = {
              ...prev.currentPiece,
              position: { ...prev.currentPiece.position, y: prev.currentPiece.position.y + 1 },
            };
            if (!checkCollision(prev.board, movedPiece)) {
              return {
                ...prev,
                currentPiece: movedPiece,
                score: prev.score + 1, // Бонус за soft drop
              };
            }
            break;
          }
          case 'ArrowUp': {
            // Rotate
            const rotatedPiece = tryRotate(prev.board, prev.currentPiece);
            if (rotatedPiece) {
              return { ...prev, currentPiece: rotatedPiece };
            }
            break;
          }
        }

        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameStatus, gameState.currentPiece, gameState.canHold]);

  // Пауза при потере фокуса
  useEffect(() => {
    const handleBlur = () => {
      if (gameState.gameStatus === 'playing') {
        setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [gameState.gameStatus]);

  // Старт игры
  const startGame = () => {
    const newPiece = createTetromino(gameState.nextPiece);
    setGameState({
      board: createInitialGameState().board,
      currentPiece: newPiece,
      nextPiece: generateRandomPiece(),
      holdPiece: null,
      canHold: true,
      score: 0,
      level: 0,
      lines: 0,
      gameStatus: 'playing',
    });
  };

  // Рендер превью фигуры
  const renderPreview = (type: TetrominoType | null) => {
    if (!type) return null;

    const shape = type === 'I' ? [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ] : type === 'O' ? [
      [1, 1],
      [1, 1],
    ] : [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    // Получаем реальную форму из логики
    const tempPiece = createTetromino(type);
    const previewSize = 20;

    return (
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${tempPiece.shape[0].length}, ${previewSize}px)` }}>
        {tempPiece.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: previewSize,
                height: previewSize,
                backgroundColor: cell ? TETROMINO_COLORS[type] : 'transparent',
                border: cell ? '1px solid rgba(255,255,255,0.3)' : 'none',
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <article
      className="h-full w-full flex flex-col bg-gray-200 p-2"
      role="main"
      aria-label="Tetris game"
    >
      {/* HUD */}
      <div
        className="flex items-center justify-between p-2 mb-2 border-2"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          background: '#c0c0c0',
        }}
      >
        <div className="flex items-center gap-4 text-sm font-bold">
          <div>Score: <span className="text-green-600">{gameState.score}</span></div>
          <div>Level: <span className="text-blue-600">{gameState.level}</span></div>
          <div>Lines: <span className="text-purple-600">{gameState.lines}</span></div>
          <div>High: <span className="text-red-600">{highScore}</span></div>
        </div>
        <div className="text-xs text-gray-600">
          {gameState.gameStatus === 'idle' && 'Press Space to Start'}
          {gameState.gameStatus === 'playing' && 'Playing...'}
          {gameState.gameStatus === 'paused' && 'Paused (Press P)'}
          {gameState.gameStatus === 'gameover' && 'Game Over!'}
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex gap-2">
        {/* Hold piece panel */}
        <div
          className="flex flex-col items-center p-2 border-2"
          style={{
            boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
            background: '#c0c0c0',
          }}
        >
          <div className="text-xs font-bold mb-2">HOLD</div>
          <div className="bg-black p-2 border border-gray-600">
            {renderPreview(gameState.holdPiece)}
          </div>
          <div className="text-xs mt-2 text-gray-600">Press C</div>
        </div>

        {/* Main board */}
        <div
          className="border-2 overflow-hidden"
          style={{
            boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
            background: '#000000',
          }}
        >
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={BOARD_PIXEL_WIDTH}
              height={BOARD_PIXEL_HEIGHT}
              className="block"
              style={{ imageRendering: 'pixelated' }}
              aria-label="Tetris game board"
            />

            {/* Overlays */}
            {gameState.gameStatus === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center text-white">
                  <div className="text-4xl mb-4">🎮</div>
                  <div className="text-2xl font-bold mb-2">Tetris</div>
                  <div className="text-sm">Press Space to Start</div>
                  <div className="text-xs mt-4 text-gray-400">
                    ← → : Move<br />
                    ↑ : Rotate<br />
                    ↓ : Soft Drop<br />
                    Space : Hard Drop<br />
                    C : Hold<br />
                    P : Pause
                  </div>
                </div>
              </div>
            )}

            {gameState.gameStatus === 'paused' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center text-white">
                  <div className="text-4xl mb-4">⏸️</div>
                  <div className="text-2xl font-bold">Paused</div>
                  <div className="text-sm mt-2">Press P to Resume</div>
                </div>
              </div>
            )}

            {gameState.gameStatus === 'gameover' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center text-white">
                  <div className="text-4xl mb-4">💀</div>
                  <div className="text-2xl font-bold text-red-500 mb-2">Game Over!</div>
                  <div className="text-lg mb-2">Score: {gameState.score}</div>
                  {gameState.score >= highScore && gameState.score > 0 && (
                    <div className="text-sm text-yellow-400 mb-2">🏆 New High Score!</div>
                  )}
                  <div className="text-sm">Press Space to Restart</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next piece panel */}
        <div
          className="flex flex-col items-center p-2 border-2"
          style={{
            boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
            background: '#c0c0c0',
          }}
        >
          <div className="text-xs font-bold mb-2">NEXT</div>
          <div className="bg-black p-2 border border-gray-600">
            {renderPreview(gameState.nextPiece)}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-600 text-center">
        <p>← → : Move | ↑ : Rotate | ↓ : Soft Drop | Space : Hard Drop | C : Hold | P : Pause</p>
      </div>
    </article>
  );
}
