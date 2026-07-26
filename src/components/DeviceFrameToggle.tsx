import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameToggleProps {
  isDeviceFrame: boolean;
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameToggleProps> = ({
  isDeviceFrame,
  children,
}) => {
  if (!isDeviceFrame) {
    return <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">{children}</div>;
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen w-full bg-zinc-900/95 dark:bg-black py-6 px-2 flex items-center justify-center transition-colors">
      {/* Android Device Shell Container */}
      <div className="w-full max-w-[420px] h-[850px] bg-zinc-50 dark:bg-zinc-900 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[10px] border-zinc-800 dark:border-zinc-800/90 relative flex flex-col overflow-hidden ring-1 ring-zinc-700/50">
        
        {/* Android Top Status Bar */}
        <div className="w-full bg-zinc-100/90 dark:bg-zinc-900/90 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shrink-0 z-40 select-none">
          <span>{currentTime}</span>

          {/* Notch / Camera Pill */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-zinc-800 dark:fill-zinc-200" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-zinc-50 dark:bg-zinc-900">
          {children}
        </div>

        {/* Android Bottom Navigation Gesture Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-900 py-2.5 flex justify-center shrink-0 z-40 border-t border-zinc-200/40 dark:border-zinc-800/40">
          <div className="w-32 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
