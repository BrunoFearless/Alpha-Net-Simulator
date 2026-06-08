import { FC, useState, useEffect } from 'react';
import { MOCK_COMMUNITIES } from '../data';
import { motion } from 'motion/react';
import { Users, Code2, Shield, Palette, Check } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Brain: Code2,
  Palette: Palette,
  Shield: Shield
};

export const CommunitiesView: FC = () => {
  const [joinedNodes, setJoinedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('alpha_net_joined_nodes');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {}
    }
    return new Set(['c_1']);
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_joined_nodes', JSON.stringify(Array.from(joinedNodes)));
  }, [joinedNodes]);

  const handleToggleJoin = (id: string) => {
    const next = new Set(joinedNodes);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setJoinedNodes(next);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 px-1 sm:px-2">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-2">COMMUNITIES</h2>
        <p className="text-zinc-400 font-mono text-xs sm:text-sm max-w-xl">
          Discover decentralized hubs. Join nodes to synchronize data feeds and collaborate with other entities in the network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {MOCK_COMMUNITIES.map((community, i) => {
          const Icon = ICON_MAP[community.icon] || Users;
          const isJoined = joinedNodes.has(community.id);
          
          return (
            <motion.div 
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
              className="bg-white/5 p-5 sm:p-6 rounded-3xl relative overflow-hidden group hover:bg-white/10 transition-colors border border-white/5"
            >
              <div 
                className="absolute top-0 right-0 w-28 sm:w-32 h-28 sm:h-32 blur-[50px] sm:blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" 
                style={{ backgroundColor: community.themeColor }} 
              />
              
              <div className="flex items-start justify-between relative z-10 mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black/40 border border-white/10 ring-1 ring-white/5"
                >
                  <Icon className="w-6 h-6" style={{ color: community.themeColor }} />
                </div>
                <button 
                  onClick={() => handleToggleJoin(community.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 border ${
                    isJoined 
                      ? 'bg-transparent text-[#A5E600] border-[#A5E600]/30 hover:bg-[#A5E600]/10' 
                      : 'bg-white text-black border-transparent hover:bg-zinc-200'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> CONNECTED
                    </>
                  ) : (
                    'JOIN NODE'
                  )}
                </button>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold font-display mb-2">{community.name}</h3>
                <p className="text-sm text-zinc-400 mb-6 min-h-[40px] leading-relaxed">
                  {community.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-zinc-400" />
                    {(community.members / 1000).toFixed(1)}k Entities
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A5E600] shadow-[0_0_8px_#A5E600]" />
                    Active Sync
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
