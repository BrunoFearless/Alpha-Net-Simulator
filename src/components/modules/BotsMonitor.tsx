import { FC, useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

export const BotsMonitor: FC<{ color: string }> = ({ color }) => {
  const [active, setActive] = useState(true);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10" style={{ borderColor: color }}>
        <span className="font-mono text-sm text-white">Bot Alpha</span>
        <span className="text-xs font-mono" style={{ color }}>{active ? 'RUNNING' : 'PAUSED'}</span>
      </div>
      <div className="flex gap-2">
        <button className="p-2 bg-white/10 rounded-lg" onClick={() => setActive(true)}><Play className="w-4 h-4" /></button>
        <button className="p-2 bg-white/10 rounded-lg" onClick={() => setActive(false)}><Pause className="w-4 h-4" /></button>
        <button className="p-2 bg-white/10 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
