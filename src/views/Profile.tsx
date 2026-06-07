import { FC, useState, useEffect } from 'react';
import { CURRENT_USER } from '../data';
import { motion } from 'motion/react';
import { Settings, MapPin, Link2, Grid, Award, Save, X } from 'lucide-react';

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
              <img src={CURRENT_USER.avatar} alt="Avatar" className="w-32 h-32 rounded-3xl bg-zinc-950 border-4 border-[#020202] relative z-10" />
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
          {['Transmissões', 'Mídia', 'Nós', 'Dados'].map((tab, i) => (
            <button key={tab} className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors ${i === 0 ? 'text-white border-b-2 border-white bg-white/5' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid Placeholder for Content */}
      <div className="mt-6 flex flex-col gap-4 items-center justify-center py-20 text-zinc-600 font-mono text-sm bg-white/5 rounded-3xl border border-white/5">
        <Grid className="w-8 h-8 opacity-50 mb-2" />
        Nenhum fragmento de dados histórico encontrado no terminal.
      </div>
    </div>
  );
};
