import { FC, useState, useEffect } from 'react';
import { CURRENT_USER } from '../data';
import { AvatarConfig } from '../types';
import { CustomAvatar } from '../components/CustomAvatar';
import { Palette, Scissors, Shirt, Glasses, Check, Lock } from 'lucide-react';
import { motion } from 'motion/react';

type Tab = 'skin' | 'hair' | 'clothes' | 'accessories';

const SHOP_ITEMS = {
  skinColor: [
    { id: '#ffdbb4', label: 'Claro 1', cost: 0 },
    { id: '#edb98a', label: 'Claro 2', cost: 0 },
    { id: '#cb8e62', label: 'Médio 1', cost: 0 },
    { id: '#8e583e', label: 'Médio 2', cost: 0 },
    { id: '#5c3826', label: 'Escuro 1', cost: 0 },
    { id: '#e0e0e0', label: 'Sintético Prata', cost: 5000 },
    { id: '#3BA8FF', label: 'Neon Azul', cost: 15000 },
    { id: '#A5E600', label: 'Neon Verde', cost: 15000 },
  ],
  hairStyle: [
    { id: 'none', label: 'Careca', cost: 0 },
    { id: 'bacon', label: 'Cabelo Bacon', cost: 0 },
    { id: 'block_spiky', label: 'Espetado de Blocos', cost: 2000 },
    { id: 'block_short', label: 'Quadrado Curto', cost: 3000 },
    { id: 'block_messy', label: 'Bagunçado Cúbico', cost: 4000 },
    { id: 'block_fade', label: 'Fade Blocky', cost: 5000 },
    { id: 'block_long', label: 'Longo Voxel', cost: 8000 },
  ],
  hairColor: [
    { id: '#090806', label: 'Preto', cost: 0 },
    { id: '#2c222b', label: 'Castanho Escuro', cost: 0 },
    { id: '#71593e', label: 'Castanho Claro', cost: 0 },
    { id: '#b89778', label: 'Loiro', cost: 0 },
    { id: '#d6c4c2', label: 'Branco', cost: 1000 },
    { id: '#ff4a4a', label: 'Vermelho Neon', cost: 3000 },
    { id: '#3ba8ff', label: 'Azul Neon', cost: 3000 },
    { id: '#b84cff', label: 'Roxo Neon', cost: 3000 },
  ],
  clothingStyle: [
    { id: 'basic', label: 'Camiseta Básica', cost: 0 },
    { id: 'jacket', label: 'Jaqueta Urbana', cost: 2000 },
    { id: 'hoodie', label: 'Moletom Hacker', cost: 4000 },
  ],
  clothingColor: [
    { id: '#111111', label: 'Escuro', cost: 0 },
    { id: '#ffffff', label: 'Claro', cost: 0 },
    { id: '#3ba8ff', label: 'Azul Base', cost: 1000 },
    { id: '#a5e600', label: 'Verde Base', cost: 1000 },
    { id: '#b84cff', label: 'Roxo Épico', cost: 4000 },
    { id: '#ffd83d', label: 'Dourado Lenda', cost: 10000 },
  ],
  accessory: [
    { id: 'none', label: 'Sem Acessório', cost: 0 },
    { id: 'glasses', label: 'Óculos Nerd', cost: 1500 },
    { id: 'mask', label: 'Máscara Filtro', cost: 3000 },
    { id: 'headset', label: 'Headset Comms', cost: 4500 },
    { id: 'visor', label: 'Visor Holográfico', cost: 8000 },
    { id: 'catears', label: 'Orelhas Neko', cost: 12000 },
    { id: 'cybereye', label: 'Implante Ocular', cost: 15000 },
    { id: 'tiara', label: 'Coroa Imperial', cost: 25000 },
  ]
};

export const AvatarEditorView: FC = () => {
  const [tokens, setTokens] = useState(() => parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));
  
  const [ownedItems, setOwnedItems] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('alpha_net_avatar_inventory');
    if (saved) return JSON.parse(saved);
    
    // Default owned items (cost 0)
    const initial: Record<string, string[]> = {};
    for (const [category, items] of Object.entries(SHOP_ITEMS)) {
      initial[category] = items.filter(i => i.cost === 0).map(i => i.id);
    }
    return initial;
  });

  const [activeTab, setActiveTab] = useState<Tab>('skin');
  
  const initialConfig = CURRENT_USER.avatarConfig || {
    skinColor: '#ffdbb4',
    hairStyle: 'bacon',
    hairColor: '#090806',
    clothingStyle: 'basic',
    clothingColor: '#111111',
    accessory: 'none'
  };

  const [savedConfig, setSavedConfig] = useState<AvatarConfig>(initialConfig);
  const [previewConfig, setPreviewConfig] = useState<AvatarConfig>(initialConfig);

  useEffect(() => {
    const handleStorage = () => setTokens(parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSelectItem = (category: keyof typeof SHOP_ITEMS, item: any) => {
    setPreviewConfig(prev => ({ ...prev, [category]: item.id }));
  };

  const getUnownedItems = () => {
    const unowned: { category: string; id: string; cost: number }[] = [];
    (Object.keys(previewConfig) as Array<keyof AvatarConfig>).forEach(cat => {
      const selectedId = previewConfig[cat];
      if (!ownedItems[cat]?.includes(selectedId)) {
        // @ts-ignore
        const item = SHOP_ITEMS[cat].find((i: any) => i.id === selectedId);
        if (item) {
          unowned.push({ category: cat, id: selectedId, cost: item.cost });
        }
      }
    });
    return unowned;
  };

  const unownedItems = getUnownedItems();
  const totalCost = unownedItems.reduce((acc, item) => acc + item.cost, 0);
  const hasChanges = JSON.stringify(previewConfig) !== JSON.stringify(savedConfig);

  const handleSave = () => {
    if (tokens >= totalCost) {
      if (totalCost > 0) {
        const newTokens = tokens - totalCost;
        setTokens(newTokens);
        localStorage.setItem('alpha_net_tokens', newTokens.toString());
        window.dispatchEvent(new Event('storage'));
      }

      let newInventory = { ...ownedItems };
      unownedItems.forEach(item => {
         newInventory = { ...newInventory, [item.category]: [...(newInventory[item.category] || []), item.id] };
      });
      setOwnedItems(newInventory);
      localStorage.setItem('alpha_net_avatar_inventory', JSON.stringify(newInventory));

      CURRENT_USER.avatarConfig = previewConfig;
      setSavedConfig(previewConfig);
      
      const profileSaved = localStorage.getItem('alpha_net_profile');
      if (profileSaved) {
         const p = JSON.parse(profileSaved);
         p.avatarConfig = previewConfig;
         localStorage.setItem('alpha_net_profile', JSON.stringify(p));
      } else {
         localStorage.setItem('alpha_net_profile', JSON.stringify({ avatarConfig: previewConfig }));
      }
      window.dispatchEvent(new Event('avatarConfigUpdated'));
    }
  };

  const handleReset = () => {
    setPreviewConfig(savedConfig);
  };

  const renderGrid = (category: keyof typeof SHOP_ITEMS, showColors: boolean = false) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SHOP_ITEMS[category].map(item => {
          const isOwned = ownedItems[category]?.includes(item.id);
          // @ts-ignore
          const isPreviewing = previewConfig[category] === item.id;
          const isSaved = savedConfig[category as keyof AvatarConfig] === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectItem(category, item)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                isPreviewing ? 'bg-[#3BA8FF]/10 border-[#3BA8FF] shadow-[0_0_15px_rgba(59,168,255,0.2)]' :
                'bg-black/40 border-white/10 hover:border-white/30'
              }`}
            >
              {showColors ? (
                <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: item.id }} />
              ) : (
                <div className="text-sm font-semibold text-white text-center h-8 flex items-center">{item.label}</div>
              )}
              
              {!showColors && item.label !== 'Sem Acessório' && item.label !== 'Raspado' && (
                  <span className="text-xs text-zinc-400 text-center px-1">{item.label}</span>
              )}

              {isSaved ? (
                <span className="text-[10px] font-bold text-[#A5E600] bg-[#A5E600]/20 px-2 py-0.5 rounded font-mono uppercase mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Atual
                </span>
              ) : isPreviewing && !isOwned ? (
                 <span className="text-[10px] font-bold text-[#FFD83D] bg-[#FFD83D]/10 border border-[#FFD83D]/30 px-2 py-0.5 rounded font-mono uppercase mt-1">
                   Prévia
                 </span>
              ) : isOwned ? (
                 <span className="text-[10px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono uppercase mt-1">
                   Possuído
                 </span>
              ) : (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase mt-1 flex items-center gap-1 text-zinc-500 bg-white/5 border border-white/5`}>
                  <Lock className="w-3 h-3" />
                  {item.cost} TK
                </span>
              )}
            </button>
          )
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-20">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white flex items-center gap-3">
            <Palette className="w-8 h-8 text-[#FFD83D]" />
            Estúdio de Avatar
          </h1>
          <p className="text-zinc-400 font-mono mt-2 text-sm max-w-xl">
            Gaste seus tokens para personalizar sua identidade visual na rede.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-1">Seu Saldo</p>
          <p className="text-2xl font-display font-bold text-[#A5E600]">{tokens.toLocaleString()} TOKENS</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Preview Area */}
        <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center aspect-square relative shadow-inner overflow-hidden">
             {/* Backdrop grid */}
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
             <div className="w-full h-full relative z-10 drop-shadow-2xl">
               <CustomAvatar config={previewConfig} />
             </div>
          </div>
          
          {hasChanges && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleSave}
                disabled={tokens < totalCost}
                className={`w-full py-4 rounded-xl font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${tokens >= totalCost ? 'bg-[#3BA8FF] hover:bg-[#3BA8FF]/90 text-black shadow-[0_0_20px_rgba(59,168,255,0.3)]' : 'bg-white/5 border border-[#FF4A4A]/30 text-[#FF4A4A] cursor-not-allowed opacity-80'}`}
              >
                {totalCost === 0 ? (
                  <><Check className="w-5 h-5" /> SALVAR MUDANÇAS</>
                ) : (
                  tokens >= totalCost ? `COMPRAR E SALVAR (${totalCost} TK)` : `FALTAM ${totalCost - tokens} TK`
                )}
              </button>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 font-mono text-sm transition-all border border-white/5 hover:border-white/20"
              >
                DESFAZER PRÉVIA
              </button>
            </div>
          )}
          
          {!hasChanges && (
            <button 
              disabled
              className="w-full py-4 rounded-xl bg-white/5 text-zinc-500 font-bold font-mono tracking-wider border border-white/10 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> AVATAR ATUAL
            </button>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1">
           <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
             {[
               { id: 'skin', icon: Palette, label: 'Corpo' },
               { id: 'hair', icon: Scissors, label: 'Cabelo' },
               { id: 'clothes', icon: Shirt, label: 'Roupa' },
               { id: 'accessories', icon: Glasses, label: 'Acessório' },
             ].map(t => {
               const Icon = t.icon;
               const isActive = activeTab === t.id;
               return (
                 <button 
                   key={t.id}
                   onClick={() => setActiveTab(t.id as Tab)}
                   className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold font-mono uppercase transition-colors ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{t.label}</span>
                 </button>
               )
             })}
           </div>

           <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              {activeTab === 'skin' && (
                <div>
                   <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-display uppercase tracking-widest text-[#3BA8FF]">Pele Metálica / Orgânica</h3>
                   {renderGrid('skinColor', true)}
                </div>
              )}

              {activeTab === 'hair' && (
                <div className="space-y-8">
                   <div>
                     <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-display uppercase tracking-widest text-[#3BA8FF]">Corte</h3>
                     {renderGrid('hairStyle', false)}
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-display uppercase tracking-widest text-[#3BA8FF]">Tinta / Pigmento</h3>
                     {renderGrid('hairColor', true)}
                   </div>
                </div>
              )}

              {activeTab === 'clothes' && (
                <div className="space-y-8">
                   <div>
                     <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-display uppercase tracking-widest text-[#3BA8FF]">Modelo</h3>
                     {renderGrid('clothingStyle', false)}
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-display uppercase tracking-widest text-[#3BA8FF]">Cores Primárias</h3>
                     {renderGrid('clothingColor', true)}
                   </div>
                </div>
              )}

              {activeTab === 'accessories' && (
                <div>
                   <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-display uppercase tracking-widest text-[#3BA8FF]">Modificadores Oculares</h3>
                   {renderGrid('accessory', false)}
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
