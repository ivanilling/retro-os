import React, { useCallback } from 'react';
import { useWindowStore } from '../store/windowStore';
import { appRegistry } from '../apps/registry';
import DesktopIcon from './DesktopIcon';

// Only show main apps on desktop (not settings/about)
const desktopApps = appRegistry.filter(app => !['settings', 'about'].includes(app.id));

export default function Desktop() {
  const openWindow = useWindowStore(s => s.openWindow);
  const closeStartMenu = useWindowStore(s => s.closeStartMenu);

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeStartMenu();
    }
  }, [closeStartMenu]);

  return (
    <main
      className="absolute inset-0 bottom-10 overflow-hidden desktop-area"
      onClick={handleDesktopClick}
      role="application"
      aria-label="Desktop"
      style={{
        background: 'linear-gradient(135deg, #008080 0%, #006666 50%, #004d4d 100%)',
      }}
    >
      {/* Desktop Icons */}
      {desktopApps.map((app, index) => (
        <DesktopIcon
          key={app.id}
          id={app.id}
          label={app.title}
          icon={app.icon}
          defaultX={20}
          defaultY={20 + index * 90}
          onDoubleClick={() => openWindow(app.id, app.title, app.id, app.defaultSize)}
        />
      ))}

      {/* Additional desktop icons */}
      <DesktopIcon
        id="my-computer"
        label="My Computer"
        icon="🖥️"
        defaultX={20}
        defaultY={20 + desktopApps.length * 90}
        onDoubleClick={() => openWindow('about', 'About', 'about', { w: 450, h: 500 })}
      />
      <DesktopIcon
        id="recycle-bin"
        label="Recycle Bin"
        icon="🗑️"
        defaultX={20}
        defaultY={20 + (desktopApps.length + 1) * 90}
        onDoubleClick={() => {}}
      />

      {/* SEO Content - Hidden but accessible to search engines and screen readers */}
      <div className="sr-only" aria-hidden="false">
        <h1>Alex Chen - Full Stack Developer Portfolio</h1>
        <p>Full-stack developer with 5+ years of experience building modern web applications. Passionate about creating beautiful, performant, and accessible user interfaces.</p>
        <section>
          <h2>Projects</h2>
          <ul>
            <li>Retro OS Portfolio - A Windows 95-inspired portfolio website built with React, TypeScript, and Tailwind CSS. Features a full window management system, terminal emulator, and CRT effects.</li>
            <li>Cloud Dashboard - Real-time cloud infrastructure monitoring dashboard with live metrics, alerting, and auto-scaling controls. Built for DevOps teams using React, D3.js, WebSocket, and Go.</li>
            <li>AI Chat Platform - Multi-model AI chat application with conversation history, code generation, and image creation. Features streaming responses and markdown rendering. Built with Next.js, OpenAI, Prisma, and tRPC.</li>
            <li>E-Commerce Engine - Headless commerce platform with inventory management, order processing, and multi-tenant support. Handles 10k+ orders/day. Built with Node.js, PostgreSQL, Redis, and Stripe.</li>
            <li>Open Source UI Library - A collection of 50+ accessible, customizable React components with full TypeScript support. 2k+ GitHub stars and growing.</li>
          </ul>
        </section>
        <section>
          <h2>Skills</h2>
          <p>Languages: TypeScript, JavaScript, Python, Rust. Frontend: React, Vue, Svelte, Tailwind CSS. Backend: Node.js, Express, FastAPI, Go. Database: PostgreSQL, MongoDB, Redis. DevOps: Docker, Kubernetes, AWS, CI/CD. Other: GraphQL, WebSocket, WebRTC.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>Email: alex@example.com | GitHub: github.com/alexchen | LinkedIn: linkedin.com/in/alexchen | Twitter: @alexchen_dev</p>
        </section>
      </div>
    </main>
  );
}
