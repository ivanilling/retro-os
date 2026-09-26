import React, { useEffect, useState } from 'react';

interface BSODProps {
  isActive: boolean;
  onReboot: () => void;
}

export default function BSOD({ isActive, onReboot }: BSODProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isActive) {
      setCountdown(5);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onReboot, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onReboot]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ 
        backgroundColor: '#0000AA',
        animation: 'fadeIn 0.5s ease-in',
      }}
    >
      <div className="text-white font-mono text-center p-8 max-w-2xl">
        <div className="bg-white text-blue-900 inline-block px-4 py-2 mb-6 font-bold">
          Retro OS
        </div>
        
        <p className="text-lg mb-6">
          A problem has been detected and Retro OS has been shut down to prevent damage to your computer.
        </p>
        
        <p className="text-sm mb-4">
          DRIVER_IRQL_NOT_LESS_OR_EQUAL
        </p>
        
        <p className="text-sm mb-8">
          If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:
        </p>
        
        <p className="text-xs mb-8 text-left">
          Check to make sure any new hardware or software is properly installed.<br/>
          If this is a new installation, ask your hardware or software manufacturer<br/>
          for any Retro OS updates you might need.
        </p>
        
        <p className="text-sm mb-4">
          Technical information:
        </p>
        
        <p className="text-xs mb-8">
          *** STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)
        </p>
        
        <p className="text-sm">
          Rebooting in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
