import React from 'react';
import { useSettingsStore } from '../store/settingsStore';

export default function CRTOverlay() {
  const crtEnabled = useSettingsStore(s => s.crtEnabled);
  const performanceMode = useSettingsStore(s => s.performanceMode);

  if (!crtEnabled || performanceMode) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99999] crt-overlay"
      aria-hidden="true"
    >
      {/* Scanlines */}
      <div className="absolute inset-0 crt-scanlines" />
      {/* Vignette */}
      <div className="absolute inset-0 crt-vignette" />
      {/* Subtle flicker */}
      <div className="absolute inset-0 crt-flicker" />
    </div>
  );
}
