import { FC } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { CURRENT_USER } from '../data';

export const Topbar: FC = () => {
  return (
    <div className="h-20 fixed top-0 right-0 left-64 bg-black/10 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-8 z-40">
      <div className="w-96 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-[#3BA8FF] transition-colors" />
        <input 
          type="text" 
          placeholder="Search network entities, protocols..." 
          className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#3BA8FF]/50 focus:bg-white/10 transition-all font-mono"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-1 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <img src={CURRENT_USER.avatar} alt="Avatar" className="w-7 h-7 rounded-full bg-zinc-800" />
          <span className="text-sm font-medium pr-2 text-zinc-200">{CURRENT_USER.username}</span>
          <ChevronDown className="w-4 h-4 text-zinc-500 pr-1" />
        </div>
      </div>
    </div>
  );
};
