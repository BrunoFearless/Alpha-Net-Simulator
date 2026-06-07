import { FC, useState, useEffect } from 'react';
import { CURRENT_USER } from '../data';
import { motion } from 'motion/react';
import { Settings, MapPin, Link2, Grid, Award, Save, X, Eye, Cpu, Hexagon, Palette, Key, Crown, Rocket } from 'lucide-react';
import { AvatarDisplay } from '../components/AvatarDisplay';

export const ProfileView: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('alpha_net_profile');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch(e) {}
    }
    return {
      displayName: CURRENT_USER.displayName,
      bio: CURRENT_USER.bio,
    };
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_profile', JSON.stringify(profile));
  }, [profile]);

  const [activeTab, setActiveTab] = useState('Transmissões');
  const [tokens, setTokens] = useState(() => parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));

  useEffect(() => {
    const handleStorage = () => {
      setTokens(parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [purchasedBadges, setPurchasedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('alpha_net_purchased_badges');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_purchased_badges', JSON.stringify(purchasedBadges));
  }, [purchasedBadges]);

  const shopItems = [
    { id: 'badge_1', type: 'badge', title: 'Explorador do Vazio', cost: 1000, icon: Rocket, color: '#3BA8FF' },
    { id: 'badge_2', type: 'badge', title: 'Mestre da Alpha', cost: 5000, icon: Crown, color: '#FFD83D' },
    { id: 'badge_3', type: 'badge', title: 'Entidade Transcendental', cost: 50000, icon: Award, color: '#FF4A4A' },
    { id: 'badge_4', type: 'badge', title: 'Oráculo de Dados', cost: 150000, icon: Eye, color: '#A5E600' },
    { id: 'badge_5', type: 'badge', title: 'Arquiteto de Sistemas', cost: 500000, icon: Cpu, color: '#B84CFF' },
    { id: 'badge_6', type: 'badge', title: 'Senhor do Vazio', cost: 1000000, icon: Hexagon, color: '#FFFFFF' },
    { id: 'item_1', type: 'theme', title: 'Tema Holográfico', cost: 250000, icon: Palette, color: '#3BA8FF' },
    { id: 'item_2', type: 'module', title: 'Acesso VIP Backend', cost: 10000, icon: Key, color: '#FFD83D' },
  ];

  const handlePurchase = (item: any) => {
    if (tokens >= item.cost && !purchasedBadges.includes(item.id)) {
      const newTokens = tokens - item.cost;
      setTokens(newTokens);
      localStorage.setItem('alpha_net_tokens', newTokens.toString());
      setPurchasedBadges(prev => [...prev, item.id]);
      
      // Update the global CURRENT_USER for this session
      if (item.type === 'badge' && !CURRENT_USER.badges.includes(item.title)) {
        CURRENT_USER.badges.push(item.title);
      }
    }
  };

  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleSave = () => {
    setProfile(tempProfile);
    CURRENT_USER.displayName = tempProfile.displayName;
    CURRENT_USER.bio = tempProfile.bio;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-3xl overflow-hidden mt-2 relative border border-white/10"
      >
        {/* Banner */}
        <div className="h-48 w-full relative bg-zinc-900 border-b border-white/10 p-6 flex justify-end overflow-hidden">
           <div className="absolute inset-0 opacity-40 mix-blend-overlay">
             <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           </div>
           <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#FFD83D]/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
           <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3BA8FF]/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
           
           {!isEditing ? (
             <button 
               onClick={() => setIsEditing(true)}
               className="relative z-10 bg-white/5 border border-white/10 h-10 px-4 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors text-sm font-semibold backdrop-blur-md"
             >
               <Settings className="w-4 h-4" /> Editar Perfil
             </button>
           ) : (
             <div className="relative z-10 flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="bg-black/50 border border-white/10 h-10 px-4 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors text-sm font-semibold backdrop-blur-md text-white"
                >
                  <X className="w-4 h-4" /> Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-[#A5E600] text-black h-10 px-6 rounded-full flex items-center gap-2 hover:bg-[#A5E600]/90 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(165,230,0,0.3)]"
                >
                  <Save className="w-4 h-4" /> Salvar Config
                </button>
             </div>
           )}
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#A5E600] rounded-full blur-xl opacity-20 pointer-events-none" />
              <AvatarDisplay user={CURRENT_USER} className="w-32 h-32 rounded-3xl bg-zinc-950 border-4 border-[#020202] relative z-10" />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#A5E600] border-2 border-[#020202] rounded-full z-20" />
            </div>
            
            <div className="flex gap-4 pb-2">
              <div className="text-center px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                <p className="font-display font-bold text-xl">{CURRENT_USER.followers.toLocaleString()}</p>
                <p className="text-xs text-zinc-500 font-mono tracking-wider">SEGUIDORES</p>
              </div>
              <div className="text-center px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                <p className="font-display font-bold text-xl">{CURRENT_USER.following}</p>
                <p className="text-xs text-zinc-500 font-mono tracking-wider">SEGUINDO</p>
              </div>
            </div>
          </div>

          <div>
            {!isEditing ? (
              <>
                <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-2">
                  {profile.displayName} 
                  <span className="text-xs px-2 py-0.5 bg-[#A5E600]/20 text-[#A5E600] rounded uppercase tracking-wider font-mono">Verificado</span>
                </h1>
                <p className="text-zinc-400 font-mono text-sm mt-1">{CURRENT_USER.username}</p>
                <p className="mt-4 text-zinc-200 leading-relaxed max-w-2xl">{profile.bio}</p>
              </>
            ) : (
              <div className="space-y-4 max-w-2xl mt-4">
                <div>
                  <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pl-1 mb-1 block">Nome de Exibição</label>
                  <input 
                    type="text" 
                    value={tempProfile.displayName}
                    onChange={e => setTempProfile({...tempProfile, displayName: e.target.value})}
                    className="w-full text-xl font-bold font-display bg-black/40 border border-[#3BA8FF]/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#3BA8FF] transition-all focus:ring-2 focus:ring-[#3BA8FF]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pl-1 mb-1 block">Biografia / Diretivas</label>
                  <textarea 
                    value={tempProfile.bio}
                    onChange={e => setTempProfile({...tempProfile, bio: e.target.value})}
                    rows={3}
                    className="w-full text-sm bg-black/40 border border-[#3BA8FF]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3BA8FF] transition-all focus:ring-2 focus:ring-[#3BA8FF]/20 resize-none font-sans"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
                <MapPin className="w-4 h-4 text-zinc-500" /> Setor 7G
              </div>
              <div className="flex items-center gap-2 text-sm text-[#3BA8FF] hover:underline cursor-pointer font-mono">
                <Link2 className="w-4 h-4 text-[#3BA8FF]" /> alpha.net/u/neo
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {CURRENT_USER.badges.map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 shadow-inner">
                  <Award className="w-3.5 h-3.5 text-[#FFD83D]" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/5">
          {['Transmissões', 'Mídia', 'Loja'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors ${activeTab === tab ? 'text-white border-b-2 border-[#12ff43] bg-white/5' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="mt-6">
        {activeTab === 'Loja' ? (
          <div className="bg-white/5 rounded-3xl border border-white/5 p-8">
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
               <div>
                 <h2 className="text-2xl font-display font-bold text-white mb-2">Loja de Melhorias Privadas</h2>
                 <p className="text-sm font-mono text-zinc-400">Adquira status sociais e aparências na Alpha Net.</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-1">Seu Saldo</p>
                 <p className="text-2xl font-display font-bold text-[#A5E600]">{tokens.toLocaleString()} TOKENS</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopItems.map(item => {
                const ItemIcon = item.icon;
                const isOwned = purchasedBadges.includes(item.id);
                const canAfford = tokens >= item.cost;
                
                return (
                  <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                        <ItemIcon className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-zinc-400 font-mono mt-1">Selo Perfil Especial</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handlePurchase(item)}
                      disabled={isOwned || !canAfford}
                      className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-colors border ${
                        isOwned 
                          ? 'border-white/10 text-zinc-500 bg-white/5 cursor-not-allowed'
                          : canAfford 
                            ? 'border-[#A5E600]/30 text-[#A5E600] bg-[#A5E600]/10 hover:bg-[#A5E600]/20'
                            : 'border-[#FF4A4A]/30 text-[#FF4A4A] bg-[#FF4A4A]/10 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {isOwned ? 'ADQUIRIDO' : canAfford ? `COMPRAR (${item.cost})` : `FALTAM ${item.cost - tokens}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center py-20 text-zinc-600 font-mono text-sm bg-white/5 rounded-3xl border border-white/5">
            <Grid className="w-8 h-8 opacity-50 mb-2" />
            Nenhum fragmento de dados histórico encontrado nesta aba.
          </div>
        )}
      </div>
    </div>
  );
};
