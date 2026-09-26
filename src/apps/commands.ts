export interface CommandContext {
  clearTerminal: () => void;
  getResolution: () => { width: number; height: number };
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string[], context: CommandContext) => string | Promise<string>;
}

// Команда: help
const helpCommand: Command = {
  name: 'help',
  description: 'Show all available commands',
  execute: async () => {
    const commands = getAllCommands();
    let output = '╔═══════════════════════════════════════════════════╗\n';
    output += '║           Available Commands                        ║\n';
    output += '╠═══════════════════════════════════════════════════╣\n';
    
    commands.forEach(cmd => {
      const padding = ' '.repeat(Math.max(0, 15 - cmd.name.length));
      output += `║  ${cmd.name}${padding} - ${cmd.description.padEnd(30)}║\n`;
    });
    
    output += '╚═══════════════════════════════════════════════════╝';
    return output;
  },
};

// Команда: clear
const clearCommand: Command = {
  name: 'clear',
  description: 'Clear terminal screen',
  execute: async (args, context) => {
    context.clearTerminal();
    return '';
  },
};

// Команда: neofetch
const neofetchCommand: Command = {
  name: 'neofetch',
  description: 'Display system information',
  execute: async (args, context) => {
    const resolution = context.getResolution();
    
    const asciiArt = `
        ████████████████████
      ██                    ██
    ██   ████████████████     ██
   ██   ██                ██   ██
  ██   ██   ██████████    ██   ██
  ██   ██   ██      ██    ██   ██
  ██   ██   ██  ██  ██    ██   ██
  ██   ██   ██      ██    ██   ██
  ██   ██   ██████████    ██   ██
  ██   ██                ██   ██
   ██   ████████████████████   ██
    ██                        ██
      ████████████████████████
`;

    const info = `
${asciiArt}
  OS: RetroOS v1.0
  Host: Portfolio Desktop
  Kernel: React 18.2.0
  Shell: RetroTerminal 1.0
  Resolution: ${resolution.width}x${resolution.height}
  Theme: Windows 95 / Mac OS 8
  Terminal: retro-term
  CPU: Virtual Core @ 3.5GHz
  Memory: 512MB / 1024MB
  Uptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m
`;
    return info;
  },
};

// Команда: matrix (удалена - теперь постоянный фон)

// Команда: about
const aboutCommand: Command = {
  name: 'about',
  description: 'About this terminal',
  execute: async () => {
    return `
╔═══════════════════════════════════════════════════╗
║  RetroOS Terminal v1.0                            ║
║  A nostalgic command-line interface               ║
║                                                   ║
║  Built with React + TypeScript                    ║
║  Inspired by Windows 95 Terminal                  ║
╚═══════════════════════════════════════════════════╝
`;
  },
};

// Команда: echo
const echoCommand: Command = {
  name: 'echo',
  description: 'Print text to terminal',
  execute: async (args) => {
    return args.join(' ');
  },
};

// Команда: date
const dateCommand: Command = {
  name: 'date',
  description: 'Show current date and time',
  execute: async () => {
    return new Date().toLocaleString();
  },
};

// Команда: whoami
const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Display current user',
  execute: async () => {
    return 'guest@retro-os';
  },
};

// Команда: ls
const lsCommand: Command = {
  name: 'ls',
  description: 'List directory contents',
  execute: async () => {
    return `
drwxr-xr-x  projects/
drwxr-xr-x  documents/
-rw-r--r--  readme.txt
-rw-r--r--  todo.md
`;
  },
};

// Команда: cat
const catCommand: Command = {
  name: 'cat',
  description: 'Display file contents',
  execute: async (args) => {
    if (args.length === 0) {
      return 'Usage: cat <filename>';
    }
    
    const filename = args[0];
    const files: Record<string, string> = {
      'readme.txt': 'Welcome to RetroOS! This is a portfolio project.',
      'todo.md': '# TODO\n- [x] Build terminal\n- [x] Add matrix effect\n- [ ] World domination',
    };
    
    return files[filename] || `cat: ${filename}: No such file or directory`;
  },
};

// Команда: projects
const projectsCommand: Command = {
  name: 'projects',
  description: 'List portfolio projects',
  execute: async () => {
    return `
📁 Projects:
  ├── retro-os-portfolio    → This website! (React + TypeScript + Tailwind)
  ├── cloud-dashboard       → Real-time monitoring dashboard
  ├── ai-chat-platform      → GPT-powered chat application
  ├── e-commerce-engine     → Headless commerce solution
  └── open-source-lib       → React component library (2k+ stars)
`;
  },
};

// Команда: contact
const contactCommand: Command = {
  name: 'contact',
  description: 'Show contact information',
  execute: async () => {
    return `
📬 Contact Me:
  Email:    alex@example.com
  GitHub:   github.com/alexchen
  LinkedIn: linkedin.com/in/alexchen
  Twitter:  @alexchen_dev
`;
  },
};

// Команда: skills
const skillsCommand: Command = {
  name: 'skills',
  description: 'Display technical skills',
  execute: async () => {
    return `
🛠️ Technical Skills:
  Languages:  TypeScript, JavaScript, Python, Rust
  Frontend:   React, Vue, Svelte, Tailwind CSS
  Backend:    Node.js, Express, FastAPI, Go
  Database:   PostgreSQL, MongoDB, Redis
  DevOps:     Docker, K8s, AWS, CI/CD
  Other:      GraphQL, WebSocket, WebRTC
`;
  },
};

// Получить все команды
export function getAllCommands(): Command[] {
  return [
    helpCommand,
    clearCommand,
    neofetchCommand,
    aboutCommand,
    echoCommand,
    dateCommand,
    whoamiCommand,
    lsCommand,
    catCommand,
    projectsCommand,
    contactCommand,
    skillsCommand,
  ];
}

// Найти команду по имени
export function findCommand(name: string): Command | undefined {
  return getAllCommands().find(cmd => cmd.name === name);
}

// Получить список имён команд для автодополнения
export function getCommandNames(): string[] {
  return getAllCommands().map(cmd => cmd.name);
}
