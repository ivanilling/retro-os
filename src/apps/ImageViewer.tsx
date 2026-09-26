import React, { useState, useEffect, useCallback } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  color: string;
  icon: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Retro OS Portfolio',
    description: 'A Windows 95-inspired portfolio website built with React, TypeScript, and Tailwind CSS. Features a full window management system, terminal emulator, and CRT effects.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Zustand'],
    color: 'from-purple-500 to-blue-600',
    icon: '🖥️',
  },
  {
    id: 2,
    title: 'Cloud Dashboard',
    description: 'Real-time cloud infrastructure monitoring dashboard with live metrics, alerting, and auto-scaling controls. Built for DevOps teams.',
    tags: ['React', 'D3.js', 'WebSocket', 'Go'],
    color: 'from-cyan-500 to-blue-600',
    icon: '☁️',
  },
  {
    id: 3,
    title: 'AI Chat Platform',
    description: 'Multi-model AI chat application with conversation history, code generation, and image creation. Features streaming responses and markdown rendering.',
    tags: ['Next.js', 'OpenAI', 'Prisma', 'tRPC'],
    color: 'from-green-500 to-emerald-600',
    icon: '🤖',
  },
  {
    id: 4,
    title: 'E-Commerce Engine',
    description: 'Headless commerce platform with inventory management, order processing, and multi-tenant support. Handles 10k+ orders/day.',
    tags: ['Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
    color: 'from-orange-500 to-red-600',
    icon: '🛒',
  },
  {
    id: 5,
    title: 'Open Source UI Library',
    description: 'A collection of 50+ accessible, customizable React components with full TypeScript support. 2k+ GitHub stars and growing.',
    tags: ['React', 'Storybook', 'Jest', 'a11y'],
    color: 'from-pink-500 to-rose-600',
    icon: '📦',
  },
  {
    id: 6,
    title: 'Real-time Collaboration',
    description: 'Google Docs-like collaborative editor with CRDT-based conflict resolution, presence indicators, and offline support.',
    tags: ['TypeScript', 'Yjs', 'WebRTC', 'IndexedDB'],
    color: 'from-yellow-500 to-amber-600',
    icon: '👥',
  },
];

export default function ImageViewer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setSelectedIndex(prev => (prev + 1) % projects.length);
    } else if (e.key === 'ArrowLeft') {
      setSelectedIndex(prev => (prev - 1 + projects.length) % projects.length);
    } else if (e.key === 'Escape') {
      setLightboxOpen(false);
    } else if (e.key === 'Enter') {
      setLightboxOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const selected = projects[selectedIndex];

  return (
    <article className="h-full w-full flex flex-col bg-gray-800" role="main" aria-label="Project Gallery">
      {/* Toolbar */}
      <div className="bg-gray-700 border-b border-gray-600 px-3 py-2 flex items-center text-xs text-gray-200">
        <button
          onClick={() => setSelectedIndex(prev => (prev - 1 + projects.length) % projects.length)}
          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded mr-2"
          aria-label="Previous project"
        >
          ◀ Prev
        </button>
        <span className="flex-1 text-center">
          {selectedIndex + 1} / {projects.length}
        </span>
        <button
          onClick={() => setSelectedIndex(prev => (prev + 1) % projects.length)}
          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded ml-2"
          aria-label="Next project"
        >
          Next ▶
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails */}
        <nav className="w-48 bg-gray-900 border-r border-gray-600 overflow-y-auto p-2" aria-label="Project thumbnails">
          {projects.map((project, i) => (
            <button
              key={project.id}
              onClick={() => setSelectedIndex(i)}
              className={`w-full text-left p-2 mb-1 rounded text-xs transition-colors ${
                i === selectedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
              aria-label={`View ${project.title}`}
              aria-current={i === selectedIndex ? 'true' : undefined}
            >
              <span className="mr-1">{project.icon}</span>
              {project.title}
            </button>
          ))}
        </nav>

        {/* Project detail */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div
            className={`w-64 h-48 rounded-lg bg-gradient-to-br ${selected.color} flex items-center justify-center text-6xl shadow-xl cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => setLightboxOpen(true)}
            role="button"
            aria-label={`Open ${selected.title} in lightbox`}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
          >
            {selected.icon}
          </div>
          <h2 className="text-white text-xl font-bold mt-4">{selected.title}</h2>
          <p className="text-gray-300 text-sm mt-2 text-center max-w-md">{selected.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {selected.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-700 text-gray-200 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Project lightbox"
        >
          <div
            className={`w-96 h-72 rounded-xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-8xl shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            {selected.icon}
          </div>
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <div className="absolute bottom-8 text-center text-white">
            <h3 className="text-xl font-bold">{selected.title}</h3>
            <p className="text-sm text-gray-300 mt-1">Press ESC to close, ← → to navigate</p>
          </div>
        </div>
      )}
    </article>
  );
}
