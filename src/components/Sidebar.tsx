import { FC } from 'react';
import { Home, Users, LayoutGrid, User, Bell, MessageSquare, Settings } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'modules', label: 'Module Hub', icon: LayoutGrid },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const bottomItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-full fixed left-0 top-0 bg-black/20 backdrop-blur-xl border-r border-white/5 flex flex-col pt-8 z-50">
      <div className="px-6 mb-10 flex items-center gap-3">
        <Logo className="w-10 h-10" />
        <div>
          <h1 className="font-display font-bold tracking-tight leading-none">ALPHA NET</h1>
          <p className="text-[10px] text-zinc-400 font-mono tracking-wider">SIMULATOR v1.0</p>
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col gap-2">
        <p className="px-2 text-xs font-mono text-zinc-500 mb-2">MAIN</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={18} className={isActive ? 'text-[#3BA8FF]' : ''} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-6 flex flex-col gap-2">
        <p className="px-2 text-xs font-mono text-zinc-500 mb-2">SYSTEM</p>
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={18} className={isActive ? 'text-[#FFD83D]' : ''} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
