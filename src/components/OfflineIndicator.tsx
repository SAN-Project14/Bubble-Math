import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-xl bg-slate-900/90 border border-amber-500/60 px-3 py-1.5 text-xs font-semibold text-amber-300 shadow-lg backdrop-blur-md animate-fade-in pointer-events-none"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>Offline Mode — Game ready to play</span>
    </div>
  );
};
