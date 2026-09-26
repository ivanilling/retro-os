import React, { useRef, useState, useEffect, useCallback } from 'react';

type Tool = 'pencil' | 'line' | 'rectangle' | 'eraser';

interface Point {
  x: number;
  y: number;
}

interface PaintAppProps {
  windowId?: string;
}

export default function PaintApp({ windowId }: PaintAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Инициализация canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      // Сохраняем текущее содержимое
      if (canvas.width > 0 && canvas.height > 0) {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx?.drawImage(canvas, 0, 0);
      }

      // Изменяем размер canvas
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Заполняем белым фоном
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Восстанавливаем содержимое
      if (tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.drawImage(tempCanvas, 0, 0);
      }

      // Сохраняем начальное состояние в историю
      if (history.length === 0) {
        saveToHistory();
      }
    };

    resizeCanvas();
    
    // Наблюдатель за изменением размера контейнера
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Сохранение в историю
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    // Ограничиваем историю последними 20 состояниями
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  // Получение координат мыши относительно canvas
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Начало рисования
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(pos);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (currentTool === 'pencil' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
      ctx.lineWidth = currentTool === 'eraser' ? brushSize * 2 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [getMousePos, currentTool, currentColor, brushSize]);

  // Процесс рисования
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !startPoint) return;

    const pos = getMousePos(e);

    if (currentTool === 'pencil' || currentTool === 'eraser') {
      // Свободное рисование
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === 'line' || currentTool === 'rectangle') {
      // Предварительный просмотр линии/прямоугольника
      requestAnimationFrame(() => {
        // Восстанавливаем последнее сохранённое состояние
        if (historyIndex >= 0 && history[historyIndex]) {
          ctx.putImageData(history[historyIndex], 0, 0);
        }

        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';

        if (currentTool === 'line') {
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        } else if (currentTool === 'rectangle') {
          const width = pos.x - startPoint.x;
          const height = pos.y - startPoint.y;
          ctx.strokeRect(startPoint.x, startPoint.y, width, height);
        }
      });
    }
  }, [isDrawing, getMousePos, currentTool, currentColor, brushSize, startPoint, history, historyIndex]);

  // Завершение рисования
  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setStartPoint(null);
    saveToHistory();
  }, [isDrawing, saveToHistory]);

  // Очистка canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, [saveToHistory]);

  // Отмена последнего действия
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  }, [history, historyIndex]);

  // Сохранение как PNG
  const saveAsPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'painting.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  // Предустановленные цвета
  const colorPalette = [
    '#000000', '#808080', '#c0c0c0', '#ffffff',
    '#ff0000', '#800000', '#ffff00', '#808000',
    '#00ff00', '#008000', '#00ffff', '#008080',
    '#0000ff', '#000080', '#ff00ff', '#800080',
  ];

  return (
    <article className="h-full w-full flex flex-col bg-gray-200" role="main" aria-label="Paint application">
      {/* Панель инструментов */}
      <div className="bg-gray-300 border-b-2 border-gray-400 p-2">
        {/* Инструменты */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold">Tools:</span>
          <button
            onClick={() => setCurrentTool('pencil')}
            className={`w-8 h-8 flex items-center justify-center border-2 ${
              currentTool === 'pencil'
                ? 'border-gray-600 bg-gray-400'
                : 'border-gray-400 bg-gray-200 hover:bg-gray-300'
            }`}
            style={{
              boxShadow: currentTool === 'pencil'
                ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff'
                : 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
            }}
            aria-label="Pencil tool"
            title="Pencil (freehand drawing)"
          >
            ✏️
          </button>
          <button
            onClick={() => setCurrentTool('line')}
            className={`w-8 h-8 flex items-center justify-center border-2 ${
              currentTool === 'line'
                ? 'border-gray-600 bg-gray-400'
                : 'border-gray-400 bg-gray-200 hover:bg-gray-300'
            }`}
            style={{
              boxShadow: currentTool === 'line'
                ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff'
                : 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
            }}
            aria-label="Line tool"
            title="Line"
          >
            📏
          </button>
          <button
            onClick={() => setCurrentTool('rectangle')}
            className={`w-8 h-8 flex items-center justify-center border-2 ${
              currentTool === 'rectangle'
                ? 'border-gray-600 bg-gray-400'
                : 'border-gray-400 bg-gray-200 hover:bg-gray-300'
            }`}
            style={{
              boxShadow: currentTool === 'rectangle'
                ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff'
                : 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
            }}
            aria-label="Rectangle tool"
            title="Rectangle"
          >
            ▭
          </button>
          <button
            onClick={() => setCurrentTool('eraser')}
            className={`w-8 h-8 flex items-center justify-center border-2 ${
              currentTool === 'eraser'
                ? 'border-gray-600 bg-gray-400'
                : 'border-gray-400 bg-gray-200 hover:bg-gray-300'
            }`}
            style={{
              boxShadow: currentTool === 'eraser'
                ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff'
                : 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
            }}
            aria-label="Eraser tool"
            title="Eraser"
          >
            🧽
          </button>

          <div className="w-px h-8 bg-gray-400 mx-2" />

          {/* Действия */}
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-2 py-1 text-xs border-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={clearCanvas}
            className="px-2 py-1 text-xs border-2 bg-gray-200 hover:bg-gray-300"
            style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
            aria-label="Clear canvas"
            title="Clear canvas"
          >
            🗑️ Clear
          </button>
          <button
            onClick={saveAsPNG}
            className="px-2 py-1 text-xs border-2 bg-gray-200 hover:bg-gray-300"
            style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
            aria-label="Save as PNG"
            title="Save as PNG"
          >
            💾 Save
          </button>
        </div>

        {/* Цвет и размер */}
        <div className="flex items-center gap-4">
          {/* Текущий цвет */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">Color:</span>
            <div
              className="w-8 h-8 border-2 border-gray-600"
              style={{
                backgroundColor: currentColor,
                boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
              }}
              aria-label={`Current color: ${currentColor}`}
            />
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-8 h-8 cursor-pointer"
              aria-label="Custom color picker"
              title="Custom color"
            />
          </div>

          {/* Палитра цветов */}
          <div className="flex gap-1">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-6 h-6 border-2 ${
                  currentColor === color ? 'border-blue-600' : 'border-gray-400'
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: currentColor === color
                    ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff'
                    : 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
                }}
                aria-label={`Select color ${color}`}
                title={color}
              />
            ))}
          </div>

          <div className="w-px h-8 bg-gray-400" />

          {/* Размер кисти */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
              aria-label={`Brush size: ${brushSize}`}
              title={`Brush size: ${brushSize}px`}
            />
            <span className="text-xs w-8">{brushSize}px</span>
          </div>
        </div>
      </div>

      {/* Canvas область */}
      <div
        ref={containerRef}
        className="flex-1 bg-white overflow-hidden"
        style={{
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair"
          aria-label="Drawing canvas"
        />
      </div>

      {/* Статусная строка */}
      <div className="bg-gray-300 border-t-2 border-gray-400 px-2 py-1 text-xs text-gray-600 flex items-center justify-between">
        <span>Tool: {currentTool}</span>
        <span>Color: {currentColor}</span>
        <span>Size: {brushSize}px</span>
      </div>
    </article>
  );
}
