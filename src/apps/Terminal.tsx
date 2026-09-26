import React, { useState, useRef, useEffect, useCallback } from 'react';

const COMMANDS = {
  help: `Available commands:
  help        - Show this help message
  about       - About me
  projects    - List my projects
  skills      - Show my skills
  contact     - Contact information
  whoami      - Who am I?
  date        - Current date/time
  clear       - Clear terminal
  echo [text] - Print text
  neofetch    - System info`,
  about: `
╔══════════════════════════════════════╗
║         Alex Chen - Developer        ║
╠══════════════════════════════════════╣
║ Full-stack developer with 5+ years   ║
║ of experience building modern web    ║
║ applications. Passionate about       ║
║ creating beautiful, performant, and  ║
║ accessible user interfaces.          ║
╚══════════════════════════════════════╝`,
  projects: `
📁 Projects:
  ├── retro-os-portfolio    → This website! (React + TypeScript + Tailwind)
  ├── cloud-dashboard       → Real-time monitoring dashboard
  ├── ai-chat-platform      → GPT-powered chat application
  ├── e-commerce-engine     → Headless commerce solution
  └── open-source-lib       → React component library (2k+ stars)`,
  skills: `
🛠️ Technical Skills:
  Languages:  TypeScript, JavaScript, Python, Rust
  Frontend:   React, Vue, Svelte, Tailwind CSS
  Backend:    Node.js, Express, FastAPI, Go
  Database:   PostgreSQL, MongoDB, Redis
  DevOps:     Docker, K8s, AWS, CI/CD
  Other:      GraphQL, WebSocket, WebRTC`,
  contact: `
📬 Contact Me:
  Email:    alex@example.com
  GitHub:   github.com/alexchen
  LinkedIn: linkedin.com/in/alexchen
  Twitter:  @alexchen_dev`,
  whoami: 'guest@retro-os ~ You are a visitor exploring my portfolio!',
  date: () => new Date().toLocaleString(),
  neofetch: `
       ████████       guest@retro-os
     ██        ██     ──────────────
   ██   ██████   ██   OS: Retro OS v1.0
  ██   ██    ██   ██  Host: Portfolio
  ██   ████████   ██  Kernel: React 18
   ██            ██   Shell: WebTerminal
     ██        ██     DE: Retro Desktop
       ████████       WM: Zustand
                      Theme: Win95/MacOS8
                      Terminal: retro-term
                      CPU: Your Browser
                      Memory: ∞ / ∞`,
};

export default function Terminal() {
  const [history, setHistory] = useState<string[]>([
    '╔═══════════════════════════════════════════╗',
    '║  Retro OS Terminal v1.0                   ║',
    '║  Type "help" for available commands.      ║',
    '╚═══════════════════════════════════════════╝',
    '',
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const command = parts[0];
    const args = parts.slice(1).join(' ');

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    if (command === 'echo') {
      setHistory(prev => [...prev, `guest@retro-os:~$ ${cmd}`, args || '']);
      return;
    }

    if (command === '') {
      setHistory(prev => [...prev, 'guest@retro-os:~$ ']);
      return;
    }

    const output = (COMMANDS as any)[command];
    if (output !== undefined) {
      const result = typeof output === 'function' ? output() : output;
      setHistory(prev => [...prev, `guest@retro-os:~$ ${cmd}`, result]);
    } else {
      setHistory(prev => [...prev, `guest@retro-os:~$ ${cmd}`, `Command not found: ${command}. Type "help" for available commands.`]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
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
    }
  };

  return (
    <article
      className="h-full w-full bg-gray-900 text-green-400 font-mono text-sm p-2 overflow-hidden flex flex-col"
      role="main"
      aria-label="Terminal application"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={containerRef} className="flex-1 overflow-y-auto whitespace-pre-wrap break-words">
        {history.map((line, i) => (
          <div key={i} className="leading-5">{line}</div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-300 mr-1">guest@retro-os:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 outline-none border-none caret-green-400"
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </article>
  );
}
