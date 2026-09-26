import React, { useState, useRef, useEffect, useCallback } from 'react';
import { findCommand, getCommandNames, type CommandContext } from './commands';

interface TerminalProps {
  windowId?: string;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

export default function Terminal({ windowId }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: '╔═══════════════════════════════════════════════════╗' },
    { type: 'output', content: '║  RetroOS Terminal v1.0                            ║' },
    { type: 'output', content: '║  Type "help" for available commands               ║' },
    { type: 'output', content: '╚═══════════════════════════════════════════════════╝' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const matrixAnimationRef = useRef<number | null>(null);

  // Автопрокрутка к низу
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // Очистка терминала
  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  // Получить разрешение окна
  const getResolution = useCallback(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  // Выполнение команды
  const executeCommand = useCallback(async (commandStr: string) => {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    // Добавить команду в историю
    setLines(prev => [...prev, { type: 'input', content: `$ ${trimmed}` }]);
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Секретная команда sudo crash
    if (trimmed.toLowerCase() === 'sudo crash') {
      setLines(prev => [...prev, { 
        type: 'error', 
        content: 'CRITICAL ERROR: System crash initiated...' 
      }]);
      // Триггерим BSOD через кастомное событие
      window.dispatchEvent(new CustomEvent('trigger-bsod'));
      return;
    }

    // Парсинг команды и аргументов
    const parts = trimmed.split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);

    // Поиск команды
    const command = findCommand(commandName);
    
    if (!command) {
      setLines(prev => [...prev, { 
        type: 'error', 
        content: `Command not found: ${commandName}. Type "help" for available commands.` 
      }]);
      return;
    }

    // Создание контекста для команды
    const context: CommandContext = {
      clearTerminal,
      getResolution,
    };

    try {
      const output = await command.execute(args, context);
      if (output) {
        setLines(prev => [...prev, { type: 'output', content: output }]);
      }
    } catch (error) {
      setLines(prev => [...prev, { 
        type: 'error', 
        content: `Error executing command: ${error}` 
      }]);
    }
  }, [clearTerminal, getResolution]);

  // Обработка клавиши Enter
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 
          ? historyIndex + 1 
          : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion
      const commandNames = getCommandNames();
      const matches = commandNames.filter(name => name.startsWith(input));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setLines(prev => [...prev, { 
          type: 'output', 
          content: matches.join('  ') 
        }]);
      }
    }
  }, [input, commandHistory, historyIndex, executeCommand]);

  // Matrix эффект - постоянный фон
  useEffect(() => {
    if (!matrixCanvasRef.current) return;

    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Установка размера canvas
    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    resizeCanvas();

    // Настройка матрицы
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Анимация
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      matrixAnimationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Очистка при размонтировании
    return () => {
      if (matrixAnimationRef.current) {
        cancelAnimationFrame(matrixAnimationRef.current);
      }
    };
  }, []);

  // Фокус на input при клике
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto relative cursor-text"
      onClick={handleContainerClick}
      role="main"
      aria-label="Terminal application"
    >
      {/* Matrix overlay - permanent subtle background */}
      <canvas
        ref={matrixCanvasRef}
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Terminal content - z-index: 10, with background for readability */}
      <div className="relative bg-black/85 p-4 -m-4" style={{ zIndex: 10 }}>
        {lines.map((line, index) => (
          <div 
            key={index} 
            className={`whitespace-pre-wrap break-words ${
              line.type === 'error' ? 'text-red-500' : 
              line.type === 'input' ? 'text-cyan-400' : 
              'text-green-400'
            }`}
          >
            {line.content}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center">
          <span className="text-cyan-400 mr-2">ivanilling@retro-os:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none border-none text-green-400 caret-green-400"
            autoFocus
            aria-label="Terminal input"
            spellCheck={false}
          />
          {/* Мигающий курсор */}
          <span className="w-2 h-4 bg-green-400 animate-pulse" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
