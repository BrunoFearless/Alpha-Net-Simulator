import { FC } from 'react';
import { Home, Users, LayoutGrid, User, Bell, MessageSquare, Settings, Terminal, Target, Sparkles, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ currentView, onChangeView, mobileOpen, onCloseMobile }) => {
  const navItems = [
    { id: 'feed', label: 'Feed Central', icon: Home },
    { id: 'communities', label: 'Nós de Rede', icon: Users },
    { id: 'modules', label: 'Módulos', icon: LayoutGrid },
    { id: 'mining', label: 'Mineração de Fichas', icon: Terminal }, 
    { id: 'missions', label: 'Diretivas', icon: Target },
    { id: 'arena', label: 'Cassino & Giro', icon: Sparkles },
    { id: 'affinities', label: 'Sintonia & Criptas', icon: Heart },
    { id: 'avatar', label: 'Estúdio de Avatar', icon: User },
    { id: 'profile', label: 'Meu Perfil', icon: User },
  ];

  const bottomItems = [
    { id: 'notifications', label: 'Alertas', icon: Bell },
    { id: 'messages', label: 'Comunicações', icon: MessageSquare },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onChangeView(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-45 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <div className={`w-64 h-full fixed left-0 top-0 bg-zinc-950/90 lg:bg-black/20 backdrop-blur-xl border-r border-white/5 flex flex-col pt-8 z-50 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div>
              <h1 className="font-display font-bold tracking-tight leading-none text-white">ALPHA NET</h1>
              <p className="text-[10px] text-zinc-400 font-mono tracking-wider">SIMULATOR v1.0</p>
            </div>
          </div>
          {/* Close button for mobile screen */}
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-zinc-400 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-2">
          <p className="px-2 text-xs font-mono text-zinc-500 mb-2">MAIN</p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon size={18} className={isActive ? 'text-[#3BA8FF]' : ''} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-6 flex flex-col gap-2">
          <p className="px-2 text-xs font-mono text-zinc-400 mb-2">SYSTEM</p>
          {bottomItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon size={18} className={isActive ? 'text-[#FFD83D]' : ''} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
