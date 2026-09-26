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

  // Рисование динозавра
  const drawDino = useCallback((ctx: CanvasRenderingContext2D, dino: Dino) => {
    const { x, y, width, height, isDucking, frame } = dino;

    ctx.fillStyle = '#535353';

    if (isDucking) {
      // Присевший динозавр (шире и ниже)
      const duckWidth = 60;
      const duckHeight = 25;

      // Тело
      ctx.fillRect(x, y + 15, duckWidth, duckHeight);

      // Голова
      ctx.fillRect(x + duckWidth - 15, y + 10, 15, 15);

      // Глаз
      ctx.fillStyle = isNightRef.current ? '#000' : '#fff';
      ctx.fillRect(x + duckWidth - 8, y + 13, 3, 3);

      // Ноги (анимация)
      ctx.fillStyle = '#535353';
      if (frame % 2 === 0) {
        ctx.fillRect(x + 10, y + 40, 8, 5);
        ctx.fillRect(x + 30, y + 40, 8, 5);
      } else {
        ctx.fillRect(x + 15, y + 40, 8, 5);
        ctx.fillRect(x + 35, y + 40, 8, 5);
      }
    } else {
      // Обычный динозавр
      // Тело
      ctx.fillRect(x, y, width, height);

      // Голова
      ctx.fillRect(x + width - 10, y - 10, 15, 20);

      // Глаз
      ctx.fillStyle = isNightRef.current ? '#000' : '#fff';
      ctx.fillRect(x + width - 3, y - 7, 3, 3);

      // Хвост
      ctx.fillStyle = '#535353';
      ctx.fillRect(x - 10, y + 10, 10, 8);

      // Ноги (анимация)
      if (dino.isJumping) {
        // В прыжке ноги вместе
        ctx.fillRect(x + 10, y + height, 8, 8);
        ctx.fillRect(x + 22, y + height, 8, 8);
      } else {
        // Бег (анимация)
        if (frame % 2 === 0) {
          ctx.fillRect(x + 10, y + height, 8, 10);
          ctx.fillRect(x + 22, y + height, 8, 5);
        } else {
          ctx.fillRect(x + 10, y + height, 8, 5);
          ctx.fillRect(x + 22, y + height, 8, 10);
        }
      }
    }
  }, []);

  // Рисование кактуса
  const drawCactus = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    ctx.fillStyle = '#535353';
    const { x, y, width, height, type } = obstacle;

    if (type === 'cactus-small') {
      // Маленький кактус
      ctx.fillRect(x + 5, y, 10, height);
      ctx.fillRect(x, y + 10, 5, 15);
      ctx.fillRect(x + 15, y + 15, 5, 10);
    } else if (type === 'cactus-large') {
      // Большой кактус
      ctx.fillRect(x + 8, y, 14, height);
      ctx.fillRect(x, y + 15, 8, 20);
      ctx.fillRect(x + 22, y + 20, 8, 15);
    } else if (type === 'cactus-group') {
      // Группа кактусов
      ctx.fillRect(x + 5, y, 10, height);
      ctx.fillRect(x + 20, y + 5, 10, height - 5);
      ctx.fillRect(x + 35, y + 10, 10, height - 10);
    }
  }, []);

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
      // Крылья вверх
      ctx.fillRect(x + 15, y, 20, 10);
    } else {
      // Крылья вниз
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

  // Рисование земли
  const drawGround = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#535353';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 2);

    // Текстура земли
    const offset = distanceRef.current % 20;
    for (let i = -offset; i < CANVAS_WIDTH; i += 20) {
      ctx.fillRect(i, GROUND_Y + 5, 10, 2);
      ctx.fillRect(i + 15, GROUND_Y + 10, 5, 2);
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
      // Птеродактили на разной высоте
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

    // Обновление скорости
    speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_INCREMENT);

    // Обновление дистанции и счёта
    distanceRef.current += speedRef.current;
    const newScore = Math.floor(distanceRef.current / 10);
    setScore(newScore);

    // Цикл день/ночь каждые 700 очков
    const shouldBeNight = Math.floor(newScore / 700) % 2 === 1;
    if (shouldBeNight !== isNightRef.current) {
      isNightRef.current = shouldBeNight;
    }

    // Плавный переход день/ночь
    const targetTransition = isNightRef.current ? 1 : 0;
    nightTransitionRef.current += (targetTransition - nightTransitionRef.current) * 0.05;

    // Очистка canvas
    const bgColor = `rgb(${255 - nightTransitionRef.current * 200}, ${255 - nightTransitionRef.current * 200}, ${255 - nightTransitionRef.current * 200})`;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Обновление и отрисовка облаков
    cloudsRef.current = cloudsRef.current.filter(cloud => cloud.x > -cloud.width);
    cloudsRef.current.forEach(cloud => {
      cloud.x -= speedRef.current * 0.3;
      drawCloud(ctx, cloud);
    });

    // Добавление новых облаков
    if (Math.random() < 0.005) {
      cloudsRef.current.push({
        x: CANVAS_WIDTH,
        y: Math.random() * 100 + 20,
        width: Math.random() * 40 + 40,
      });
    }

    // Обновление динозавра
    const dino = dinoRef.current;

    // Гравитация
    if (dino.isJumping) {
      dino.velocityY += GRAVITY;
      dino.y += dino.velocityY;

      // Приземление
      if (dino.y >= GROUND_Y - (dino.isDucking ? 25 : 40)) {
        dino.y = GROUND_Y - (dino.isDucking ? 25 : 40);
        dino.velocityY = 0;
        dino.isJumping = false;
      }
    }

    // Анимация бега
    dino.frameTimer += deltaTime;
    if (dino.frameTimer > 100) {
      dino.frame = (dino.frame + 1) % 2;
      dino.frameTimer = 0;
    }

    // Обновление препятствий
    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x > -obs.width);
    obstaclesRef.current.forEach(obs => {
      obs.x -= speedRef.current;

      // Анимация птеродактиля
      if (obs.type === 'pterodactyl') {
        obs.frameTimer = (obs.frameTimer || 0) + deltaTime;
        if (obs.frameTimer > 200) {
          obs.frame = ((obs.frame || 0) + 1) % 2;
          obs.frameTimer = 0;
        }
      }

      // Отрисовка препятствия
      if (obs.type === 'pterodactyl') {
        drawPterodactyl(ctx, obs);
      } else {
        drawCactus(ctx, obs);
      }

      // Проверка коллизии
      if (checkCollision(dino, obs)) {
        // Game Over
        setGameStatus('gameover');
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('dino-highscore', newScore.toString());
        }
      }
    });

    // Генерация новых препятствий
    obstacleTimerRef.current += deltaTime;
    const minGap = Math.max(1000, 2000 - speedRef.current * 100);
    if (obstacleTimerRef.current > minGap && obstaclesRef.current.length < 3) {
      if (Math.random() < 0.02) {
        obstaclesRef.current.push(generateObstacle());
        obstacleTimerRef.current = 0;
      }
    }

    // Отрисовка земли
    drawGround(ctx);

    // Отрисовка динозавра
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

    // Очистка
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Земля
    drawGround(ctx);

    // Динозавр
    drawDino(ctx, dinoRef.current);
  }, [drawGround, drawDino]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }

      // Space/Up - прыжок или старт
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameStatus === 'idle' || gameStatus === 'gameover') {
          // Старт/рестарт
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
            // Прыжок
            dino.velocityY = JUMP_FORCE;
            dino.isJumping = true;
            dino.isDucking = false;
          } else if (dino.isDucking) {
            // Быстрое падение
            dino.velocityY = 10;
          }
        }
      }

      // Down - присесть
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

  // Форматирование счёта
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
                <div className="text-4xl mb-4">🦖</div>
                <div className="text-2xl font-bold mb-2">Dino Runner</div>
                <div className="text-sm mb-4">Press Space or ↑ to Start</div>
                <div className="text-xs text-gray-600">
                  Space/↑ : Jump<br />
                  ↓ : Duck<br />
                  Jump while ducking = Fast Fall
                </div>
              </div>
            </div>
          )}

          {gameStatus === 'gameover' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-center text-white">
                <div className="text-4xl mb-4 animate-pulse">💀</div>
                <div className="text-3xl font-bold text-red-500 mb-2 animate-pulse">GAME OVER</div>
                <div className="text-xl mb-2">Score: {formatScore(score)}</div>
                {score >= highScore && score > 0 && (
                  <div className="text-sm text-yellow-400 mb-2 animate-pulse">🏆 New High Score!</div>
                )}
                <div className="text-sm">Press Space to Restart</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-600 text-center">
        <p>Space/↑ : Jump | ↓ : Duck | Jump while ducking = Fast Fall</p>
      </div>
    </article>
  );
}
