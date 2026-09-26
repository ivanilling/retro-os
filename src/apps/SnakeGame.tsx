import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SnakeGameProps {
  windowId?: string;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

// Pixel art для головы змеи (направление вправо)
const SNAKE_HEAD_RIGHT = [
  [1, 1, 1, 1],
  [1, 0, 1, 0],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
];

export default function SnakeGame({ windowId }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const speedRef = useRef<number>(INITIAL_SPEED);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [announcement, setAnnouncement] = useState('');

  // Генерация еды
  const generateFood = useCallback((): Point => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Сброс игры
  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    foodRef.current = generateFood();
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameStatus('idle');
    setAnnouncement('Game reset. Press Space to start.');
  }, [generateFood]);

  // Проверка коллизий
  const checkCollision = useCallback((head: Point): boolean => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snakeRef.current.some((segment, index) => 
      index > 0 && segment.x === head.x && segment.y === head.y
    );
  }, []);

  // Движение змейки
  const moveSnake = useCallback(() => {
    const snake = snakeRef.current;
    const head = snake[0];
    const direction = nextDirectionRef.current;
    directionRef.current = direction;

    let newHead: Point;
    switch (direction) {
      case 'UP':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'RIGHT':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    if (checkCollision(newHead)) {
      setGameStatus('gameover');
      setAnnouncement(`Game Over! Final score: ${score}`);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snake-highscore', score.toString());
        setAnnouncement(`Game Over! New high score: ${score}`);
      }
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      const newScore = score + 10;
      setScore(newScore);
      setAnnouncement(`Score: ${newScore}`);
      foodRef.current = generateFood();
      speedRef.current = Math.max(50, speedRef.current - SPEED_INCREMENT);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
  }, [score, highScore, checkCollision, generateFood]);

  // Отрисовка
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Сетка ( faint grid )
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Еда - pixel art apple
    const foodX = foodRef.current.x * CELL_SIZE;
    const foodY = foodRef.current.y * CELL_SIZE;
    
    // Яблоко (красный квадрат)
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(foodX + 4, foodY + 6, 12, 12);
    
    // Листик (зелёный пиксель)
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(foodX + 8, foodY + 2, 4, 4);

    // Змейка
    snakeRef.current.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;

      if (index === 0) {
        // Голова с глазами
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        // Глаза (направление)
        ctx.fillStyle = '#000000';
        const direction = directionRef.current;
        if (direction === 'RIGHT') {
          ctx.fillRect(x + 12, y + 6, 3, 3);
          ctx.fillRect(x + 12, y + 12, 3, 3);
        } else if (direction === 'LEFT') {
          ctx.fillRect(x + 5, y + 6, 3, 3);
          ctx.fillRect(x + 5, y + 12, 3, 3);
        } else if (direction === 'UP') {
          ctx.fillRect(x + 6, y + 5, 3, 3);
          ctx.fillRect(x + 12, y + 5, 3, 3);
        } else {
          ctx.fillRect(x + 6, y + 12, 3, 3);
          ctx.fillRect(x + 12, y + 12, 3, 3);
        }
      } else {
        // Тело с gap
        const intensity = Math.max(100, 255 - index * 5);
        ctx.fillStyle = `rgb(0, ${intensity}, 0)`;
        ctx.fillRect(x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6);
      }
    });
  }, []);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (gameStatus !== 'playing') return;

    const deltaTime = timestamp - lastMoveTimeRef.current;

    if (deltaTime >= speedRef.current) {
      moveSnake();
      lastMoveTimeRef.current = timestamp;
    }

    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStatus, moveSnake, draw]);

  // Запуск/остановка game loop
  useEffect(() => {
    if (gameStatus === 'playing') {
      lastMoveTimeRef.current = performance.now();
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
  }, [gameStatus, gameLoop]);

  // Начальная отрисовка
  useEffect(() => {
    draw();
  }, [draw]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space') {
        if (gameStatus === 'idle' || gameStatus === 'gameover') {
          resetGame();
          setGameStatus('playing');
          setAnnouncement('Game started!');
        }
        return;
      }

      if (e.code === 'KeyP') {
        if (gameStatus === 'playing') {
          setGameStatus('paused');
          setAnnouncement('Game paused');
        } else if (gameStatus === 'paused') {
          setGameStatus('playing');
          setAnnouncement('Game resumed');
        }
        return;
      }

      if (gameStatus !== 'playing') return;

      const currentDirection = directionRef.current;
      let newDirection: Direction | null = null;

      switch (e.code) {
        case 'ArrowUp':
          if (currentDirection !== 'DOWN') newDirection = 'UP';
          break;
        case 'ArrowDown':
          if (currentDirection !== 'UP') newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          if (currentDirection !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'ArrowRight':
          if (currentDirection !== 'LEFT') newDirection = 'RIGHT';
          break;
      }

      if (newDirection) {
        nextDirectionRef.current = newDirection;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, resetGame]);

  return (
    <article
      className="h-full w-full flex flex-col bg-gray-200 p-2"
      role="main"
      aria-label="Snake game"
    >
      {/* HUD */}
      <div
        className="flex items-center justify-between p-2 mb-2 border-2"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          background: '#c0c0c0',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold">
            Score: <span className="text-green-600">{score}</span>
          </div>
          <div className="text-sm font-bold">
            High Score: <span className="text-blue-600">{highScore}</span>
          </div>
        </div>
        <div className="text-xs text-gray-600">
          {gameStatus === 'idle' && 'Press Space to Start'}
          {gameStatus === 'playing' && 'Playing...'}
          {gameStatus === 'paused' && 'Paused (Press P)'}
          {gameStatus === 'gameover' && 'Game Over! Press Space'}
        </div>
      </div>

      {/* Canvas container */}
      <div
        className="flex-1 flex items-center justify-center border-2 overflow-hidden"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          background: '#000000',
        }}
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="block"
            style={{ imageRendering: 'pixelated' }}
            aria-label="Snake game canvas"
          />

          {/* Overlays */}
          {gameStatus === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="text-3xl font-bold mb-4" style={{ fontFamily: "'VT323', monospace" }}>
                  SNAKE
                </div>
                <div className="text-sm">Press Space to Start</div>
                <div className="text-xs mt-4 text-gray-400">
                  Use Arrow Keys to Move<br />
                  P to Pause
                </div>
              </div>
            </div>
          )}

          {gameStatus === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="text-2xl font-bold" style={{ fontFamily: "'VT323', monospace" }}>
                  PAUSED
                </div>
                <div className="text-sm mt-2">Press P to Resume</div>
              </div>
            </div>
          )}

          {gameStatus === 'gameover' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="text-3xl font-bold text-red-500 mb-2" style={{ fontFamily: "'VT323', monospace" }}>
                  GAME OVER
                </div>
                <div className="text-lg mb-2">Score: {score}</div>
                {score >= highScore && score > 0 && (
                  <div className="text-sm text-yellow-400 mb-2">New High Score!</div>
                )}
                <div className="text-sm">Press Space to Restart</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ARIA live region */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-600 text-center">
        <p>Arrow Keys: Move | P: Pause | Space: Start/Restart</p>
      </div>
    </article>
  );
}
