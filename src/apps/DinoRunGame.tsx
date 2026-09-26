import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DinoRunGameProps {
  windowId?: string;
}

type GameStatus = 'idle' | 'playing' | 'gameover';

interface Dino {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  isDucking: boolean;
  frame: number;
  frameTimer: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus-small' | 'cactus-large' | 'cactus-group' | 'pterodactyl';
  frame?: number;
  frameTimer?: number;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_Y = 250;
const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const INITIAL_SPEED = 6;
const MAX_SPEED = 13;
const SPEED_INCREMENT = 0.001;

// Binary matrix sprites for Chrome Dino (string format for clarity)
// '1' = draw pixel, '0' = skip

// Dino running - frame 1 (right leg forward)
const DINO_RUN_1 = [
  "000000111110",
  "000001111111",
  "000001111110",
  "000001111100",
  "000001111100",
  "000001111100",
  "000001111100",
  "000011111100",
  "000111111100",
  "001111111100",
  "011111111100",
  "111111111100",
  "111111111100",
  "011111111100",
  "001111111100",
  "000111111100",
  "000011001100", // Legs - right forward
  "000011001100"
];

// Dino running - frame 2 (left leg forward)
const DINO_RUN_2 = [
  "000000111110",
  "000001111111",
  "000001111110",
  "000001111100",
  "000001111100",
  "000001111100",
  "000001111100",
  "000011111100",
  "000111111100",
  "001111111100",
  "011111111100",
  "111111111100",
  "111111111100",
  "011111111100",
  "001111111100",
  "000111111100",
  "000011001100", // Legs - left forward
  "000011001100"
];

// Dino ducking - wide and short
const DINO_DUCK = [
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000",
  "00000000000000000000000000000111111100",
  "00000000000000000000000000000......111111000",
  "00000000000000000000000000000......111110000",
  "00000000000000000000000000000......111110000",
  "00000000000000000000000000000......111110000",
  "00000000000000000000000000000......111110000",
  "00000000000000000000000000001.....1111110000",
  "00000000000000000000000000011....11111110000",
  "00000000000000000000000000111...111111110000",
  "00000000000000000000000001111..1111111110000",
  "00000000000000000000000011111111111111110000",
  "00000000000000000000000011111111111111110000",
  "00000000000000000000000001111111111111100000",
  "00000000000000000000000000111111111111000000",
  "00000000000000000000000000011111111110000000",
  "00000000000000000000000000001100110000000000",
  "00000000000000000000000000001100110000000000"
];

// Small cactus
const CACTUS_SMALL = [
  "00100",
  "00100",
  "00100",
  "10100",
  "10101",
  "11101",
  "00111",
  "00100",
  "00100",
  "00100"
];

// Large cactus
const CACTUS_LARGE = [
  "00011000",
  "00011000",
  "00011000",
  "00011010",
  "10011010",
  "10011110",
  "11011000",
  "01111000",
  "00011000",
  "00011000",
  "00011000",
  "00011000",
  "00011000"
];

// Cactus group (3 cacti)
const CACTUS_GROUP = [
  "001000100010",
  "001000100010",
  "001000100010",
  "101000100010",
  "101010101010",
  "111010101010",
  "001110101110",
  "001000100010",
  "001000100010",
  "001000100010"
];

export default function DinoRunGame({ windowId }: DinoRunGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const obstacleTimerRef = useRef<number>(0);

  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('dino-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const dinoRef = useRef<Dino>({
    x: 50,
    y: GROUND_Y - 40,
    width: 40,
    height: 40,
    velocityY: 0,
    isJumping: false,
    isDucking: false,
    frame: 0,
    frameTimer: 0,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const speedRef = useRef(INITIAL_SPEED);
  const distanceRef = useRef(0);
  const isNightRef = useRef(false);
  const nightTransitionRef = useRef(0);

  // Отрисовка pixel matrix (работает со строковыми матрицами)
  const drawPixelMatrix = useCallback((
    ctx: CanvasRenderingContext2D,
    matrix: string[],
    x: number,
    y: number,
    pixelSize: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === '1') {
          ctx.fillRect(
            x + col * pixelSize,
            y + row * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }, []);

  // Рисование динозавра
  const drawDino = useCallback((ctx: CanvasRenderingContext2D, dino: Dino) => {
    const { x, y, frame } = dino;
    const matrix = frame % 2 === 0 ? DINO_RUN_1 : DINO_RUN_2;
    drawPixelMatrix(ctx, matrix, x, y, 4, '#535353');
  }, [drawPixelMatrix]);

  // Рисование кактуса
  const drawCactus = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    const { x, y, type } = obstacle;
    const matrix = type === 'cactus-small' ? CACTUS_SMALL : 
                   type === 'cactus-large' ? CACTUS_LARGE : 
                   type === 'cactus-group' ? CACTUS_GROUP : CACTUS_SMALL;
    const pixelSize = type === 'cactus-large' ? 4 : type === 'cactus-group' ? 3 : 3;
    drawPixelMatrix(ctx, matrix, x, y, pixelSize, '#535353');
  }, [drawPixelMatrix]);

  // Рисование птеродактиля
  const drawPterodactyl = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    ctx.fillStyle = '#535353';
    const { x, y, frame = 0 } = obstacle;

    // Тело
    ctx.fillRect(x + 10, y + 10, 30, 8);
    // Голова
    ctx.fillRect(x + 40, y + 10, 10, 6);
    // Клюв
    ctx.fillRect(x + 50, y + 12, 8, 3);
    // Крылья (анимация)
    if (frame % 2 === 0) {
      ctx.fillRect(x + 15, y, 20, 10);
    } else {
      ctx.fillRect(x + 15, y + 18, 20, 10);
    }
  }, []);

  // Рисование облака
  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, cloud: Cloud) => {
    ctx.fillStyle = isNightRef.current ? '#333' : '#e0e0e0';
    ctx.fillRect(cloud.x, cloud.y, cloud.width, 10);
    ctx.fillRect(cloud.x + 10, cloud.y - 5, cloud.width - 20, 5);
    ctx.fillRect(cloud.x + 5, cloud.y + 10, cloud.width - 10, 5);
  }, []);

  // Рисование земли с шумовыми пикселями
  const drawGround = useCallback((ctx: CanvasRenderingContext2D) => {
    // Основная линия земли
    ctx.fillStyle = '#535353';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 2);

    // Шумовые пиксели под землёй (случайные точки)
    const offset = distanceRef.current % 4;
    ctx.fillStyle = '#535353';
    
    for (let x = -offset; x < CANVAS_WIDTH; x += 4) {
      // Случайные пиксели для создания текстуры
      if (Math.random() > 0.7) {
        ctx.fillRect(x, GROUND_Y + 3 + Math.floor(Math.random() * 3), 1, 1);
      }
      if (Math.random() > 0.8) {
        ctx.fillRect(x + 2, GROUND_Y + 5 + Math.floor(Math.random() * 2), 1, 1);
      }
      if (Math.random() > 0.9) {
        ctx.fillRect(x + 1, GROUND_Y + 7 + Math.floor(Math.random() * 2), 1, 1);
      }
    }
    
    // Более крупные камни/комки
    for (let x = -offset * 2; x < CANVAS_WIDTH; x += 20) {
      if (Math.random() > 0.6) {
        ctx.fillRect(x, GROUND_Y + 4, 2, 1);
      }
      if (Math.random() > 0.7) {
        ctx.fillRect(x + 10, GROUND_Y + 6, 3, 1);
      }
    }
  }, []);

  // Проверка коллизии
  const checkCollision = useCallback((dino: Dino, obstacle: Obstacle): boolean => {
    const dinoBox = {
      x: dino.x + 5,
      y: dino.y + 5,
      width: dino.width - 10,
      height: dino.isDucking ? 25 : dino.height - 5,
    };

    const obsBox = {
      x: obstacle.x + 3,
      y: obstacle.y + 3,
      width: obstacle.width - 6,
      height: obstacle.height - 6,
    };

    return (
      dinoBox.x < obsBox.x + obsBox.width &&
      dinoBox.x + dinoBox.width > obsBox.x &&
      dinoBox.y < obsBox.y + obsBox.height &&
      dinoBox.y + dinoBox.height > obsBox.y
    );
  }, []);

  // Генерация препятствия
  const generateObstacle = useCallback((): Obstacle => {
    const rand = Math.random();
    let type: Obstacle['type'];
    let width: number;
    let height: number;
    let y: number;

    if (rand < 0.3) {
      type = 'cactus-small';
      width = 20;
      height = 35;
      y = GROUND_Y - height;
    } else if (rand < 0.6) {
      type = 'cactus-large';
      width = 30;
      height = 50;
      y = GROUND_Y - height;
    } else if (rand < 0.85) {
      type = 'cactus-group';
      width = 45;
      height = 40;
      y = GROUND_Y - height;
    } else {
      type = 'pterodactyl';
      width = 58;
      height = 28;
      const heights = [GROUND_Y - 80, GROUND_Y - 50, GROUND_Y - 30];
      y = heights[Math.floor(Math.random() * heights.length)];
    }

    return {
      x: CANVAS_WIDTH,
      y,
      width,
      height,
      type,
      frame: 0,
      frameTimer: 0,
    };
  }, []);

  // Игровой цикл
  const gameLoop = useCallback((timestamp: number) => {
    if (gameStatus !== 'playing') return;

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_INCREMENT);
    distanceRef.current += speedRef.current;
    const newScore = Math.floor(distanceRef.current / 10);
    setScore(newScore);

    const shouldBeNight = Math.floor(newScore / 700) % 2 === 1;
    if (shouldBeNight !== isNightRef.current) {
      isNightRef.current = shouldBeNight;
    }

    const targetTransition = isNightRef.current ? 1 : 0;
    nightTransitionRef.current += (targetTransition - nightTransitionRef.current) * 0.05;

    const bgColor = `rgb(${255 - nightTransitionRef.current * 200}, ${255 - nightTransitionRef.current * 200}, ${255 - nightTransitionRef.current * 200})`;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Облака
    cloudsRef.current = cloudsRef.current.filter(cloud => cloud.x > -cloud.width);
    cloudsRef.current.forEach(cloud => {
      cloud.x -= speedRef.current * 0.3;
      drawCloud(ctx, cloud);
    });

    if (Math.random() < 0.005) {
      cloudsRef.current.push({
        x: CANVAS_WIDTH,
        y: Math.random() * 100 + 20,
        width: Math.random() * 40 + 40,
      });
    }

    // Динозавр
    const dino = dinoRef.current;

    if (dino.isJumping) {
      dino.velocityY += GRAVITY;
      dino.y += dino.velocityY;

      if (dino.y >= GROUND_Y - (dino.isDucking ? 25 : 40)) {
        dino.y = GROUND_Y - (dino.isDucking ? 25 : 40);
        dino.velocityY = 0;
        dino.isJumping = false;
      }
    }

    dino.frameTimer += deltaTime;
    if (dino.frameTimer > 100) {
      dino.frame = (dino.frame + 1) % 2;
      dino.frameTimer = 0;
    }

    // Препятствия
    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x > -obs.width);
    obstaclesRef.current.forEach(obs => {
      obs.x -= speedRef.current;

      if (obs.type === 'pterodactyl') {
        obs.frameTimer = (obs.frameTimer || 0) + deltaTime;
        if (obs.frameTimer > 200) {
          obs.frame = ((obs.frame || 0) + 1) % 2;
          obs.frameTimer = 0;
        }
      }

      if (obs.type === 'pterodactyl') {
        drawPterodactyl(ctx, obs);
      } else {
        drawCactus(ctx, obs);
      }

      if (checkCollision(dino, obs)) {
        setGameStatus('gameover');
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('dino-highscore', newScore.toString());
        }
      }
    });

    obstacleTimerRef.current += deltaTime;
    const minGap = Math.max(1000, 2000 - speedRef.current * 100);
    if (obstacleTimerRef.current > minGap && obstaclesRef.current.length < 3) {
      if (Math.random() < 0.02) {
        obstaclesRef.current.push(generateObstacle());
        obstacleTimerRef.current = 0;
      }
    }

    drawGround(ctx);
    drawDino(ctx, dino);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameStatus, highScore, drawDino, drawCactus, drawPterodactyl, drawCloud, drawGround, checkCollision, generateObstacle]);

  // Запуск/остановка игрового цикла
  useEffect(() => {
    if (gameStatus === 'playing') {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStatus, gameLoop]);

  // Начальная отрисовка
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGround(ctx);
    drawDino(ctx, dinoRef.current);
  }, [drawGround, drawDino]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameStatus === 'idle' || gameStatus === 'gameover') {
          dinoRef.current = {
            x: 50,
            y: GROUND_Y - 40,
            width: 40,
            height: 40,
            velocityY: 0,
            isJumping: false,
            isDucking: false,
            frame: 0,
            frameTimer: 0,
          };
          obstaclesRef.current = [];
          cloudsRef.current = [];
          speedRef.current = INITIAL_SPEED;
          distanceRef.current = 0;
          isNightRef.current = false;
          nightTransitionRef.current = 0;
          obstacleTimerRef.current = 0;
          setScore(0);
          setGameStatus('playing');
        } else if (gameStatus === 'playing') {
          const dino = dinoRef.current;
          if (!dino.isJumping) {
            dino.velocityY = JUMP_FORCE;
            dino.isJumping = true;
            dino.isDucking = false;
          } else if (dino.isDucking) {
            dino.velocityY = 10;
          }
        }
      }

      if (e.code === 'ArrowDown' && gameStatus === 'playing') {
        const dino = dinoRef.current;
        if (!dino.isJumping) {
          dino.isDucking = true;
          dino.height = 25;
          dino.y = GROUND_Y - 25;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' && gameStatus === 'playing') {
        const dino = dinoRef.current;
        dino.isDucking = false;
        dino.height = 40;
        if (!dino.isJumping) {
          dino.y = GROUND_Y - 40;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus]);

  const formatScore = (value: number): string => {
    return value.toString().padStart(5, '0');
  };

  return (
    <article
      className="h-full w-full flex flex-col bg-gray-200 p-2"
      role="main"
      aria-label="Dino Runner game"
    >
      {/* HUD */}
      <div
        className="flex items-center justify-between p-2 mb-2 border-2"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          background: '#c0c0c0',
        }}
      >
        <div className="text-sm font-bold">
          Score: <span className="text-green-600">{formatScore(score)}</span>
        </div>
        <div className="text-sm font-bold">
          High Score: <span className="text-blue-600">{formatScore(highScore)}</span>
        </div>
      </div>

      {/* Canvas container */}
      <div
        className="flex-1 flex items-center justify-center border-2 overflow-hidden"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
          background: '#ffffff',
        }}
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block"
            style={{ imageRendering: 'pixelated' }}
            aria-label="Dino Runner game canvas"
          />

          {/* Overlays */}
          {gameStatus === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90">
              <div className="text-center text-gray-800">
                <div className="text-3xl font-bold mb-4" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                  DINO RUNNER
                </div>
                <div className="text-sm mb-4">Press Space or Up Arrow to Start</div>
                <div className="text-xs text-gray-600">
                  Space/Up: Jump<br />
                  Down: Duck<br />
                  Jump while ducking = Fast Fall
                </div>
              </div>
            </div>
          )}

          {gameStatus === 'gameover' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-center text-white">
                <div className="text-3xl font-bold text-red-500 mb-2" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                  GAME OVER
                </div>
                <div className="text-xl mb-2">Score: {formatScore(score)}</div>
                {score >= highScore && score > 0 && (
                  <div className="text-sm text-yellow-400 mb-2">New High Score!</div>
                )}
                <div className="text-sm">Press Space to Restart</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-600 text-center">
        <p>Space/Up: Jump | Down: Duck | Jump while ducking = Fast Fall</p>
      </div>
    </article>
  );
}
