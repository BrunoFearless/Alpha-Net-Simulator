import { FC, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Cpu, Zap, Server, Shield, Database, HardDrive, Share2 } from 'lucide-react';
import { CURRENT_USER } from '../data';

interface MiningBuff {
  id: string;
  type: 'click' | 'auto';
  expiresAt: number;
}

export const DataMiningView: FC = () => {
  const [tokens, setTokens] = useState(() => {
    return parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10);
  });
  
  const [buffs, setBuffs] = useState<MiningBuff[]>(() => {
    try {
      const saved = localStorage.getItem('alpha_net_mining_buffs');
      return saved ? JSON.parse(saved) : [];
    } catch { 
      return []; 
    }
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_tokens', tokens.toString());
    // Trigger storage event so Profile updates
    window.dispatchEvent(new Event('storage'));
  }, [tokens]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setBuffs(prev => {
        const valid = prev.filter(b => b.expiresAt > now);
        if (valid.length !== prev.length) {
          localStorage.setItem('alpha_net_mining_buffs', JSON.stringify(valid));
          return valid;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const clickBuffs = buffs.filter(b => b.type === 'click');
  const autoBuffs = buffs.filter(b => b.type === 'auto');

  const clickPower = 1 + clickBuffs.length;
  const autoMineRate = 0 + autoBuffs.length;

  const upgradeCostClick = Math.floor(10 * Math.pow(1.5, clickBuffs.length));
  const upgradeCostAuto = Math.floor(50 * Math.pow(1.5, autoBuffs.length));

  useEffect(() => {
    if (autoMineRate === 0) return;
    const interval = setInterval(() => {
      setTokens(prev => prev + autoMineRate);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoMineRate]);

  const handleMine = () => {
    setTokens(prev => prev + clickPower);
  };

  const handleUpgradeClick = () => {
    if (tokens >= upgradeCostClick) {
      setTokens(prev => prev - upgradeCostClick);
      const newBuff: MiningBuff = { id: Date.now().toString(), type: 'click', expiresAt: Date.now() + 60000 };
      setBuffs(prev => {
        const next = [...prev, newBuff];
        localStorage.setItem('alpha_net_mining_buffs', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleUpgradeAuto = () => {
    if (tokens >= upgradeCostAuto) {
      setTokens(prev => prev - upgradeCostAuto);
      const newBuff: MiningBuff = { id: Date.now().toString(), type: 'auto', expiresAt: Date.now() + 60000 };
      setBuffs(prev => {
        const next = [...prev, newBuff];
        localStorage.setItem('alpha_net_mining_buffs', JSON.stringify(next));
        return next;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-white flex items-center gap-3">
          <Terminal className="w-8 h-8 text-[#A5E600]" />
          Terminal de Mineração Alpha
        </h1>
        <p className="text-zinc-400 font-mono mt-2 text-sm">
          Extraia fragmentos de dados e converta-os em Alpha Tokens. Melhore o processador para minerar no vazio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        {/* Clicker Area */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A5E600]/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-xl font-mono text-zinc-300 mb-8 absolute top-8 text-center uppercase tracking-widest">
            Tokens Acumulados
          </h2>
          
          <div className="text-7xl font-display font-bold text-white tracking-tighter mb-4 text-center">
            {tokens.toLocaleString()}
          </div>
          
          <div className="text-sm font-mono text-[#A5E600] mb-12 bg-[#A5E600]/10 px-4 py-1.5 rounded-full border border-[#A5E600]/20 flex items-center gap-2">
            <Zap className="w-4 h-4" /> {autoMineRate}/segundo
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleMine}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-[#111] to-[#222] border-4 border-[#A5E600]/30 flex items-center justify-center shadow-[0_0_40px_rgba(165,230,0,0.15)] hover:shadow-[0_0_60px_rgba(165,230,0,0.3)] transition-shadow group-hover:border-[#A5E600]/60 relative z-10"
          >
            <div className="absolute inset-2 rounded-full border border-[#A5E600]/20 border-dashed animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-6 rounded-full border border-white/5 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
            <Database className="w-16 h-16 text-[#A5E600]/80 group-hover:text-[#A5E600] transition-colors" />
          </motion.button>
          
          <p className="mt-8 text-zinc-500 font-mono text-sm">
            +{clickPower} por clique
          </p>
        </div>

        {/* Upgrades Area */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-display font-bold text-white mb-2">Subsistemas Livres</h2>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6 text-[#3BA8FF]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Processador Quântico</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">Aumenta o ganho por clique (+1)</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[10px] uppercase font-mono text-zinc-500">{clickBuffs.length} Ativos (1m)</span>
              <button 
                onClick={handleUpgradeClick}
                disabled={tokens < upgradeCostClick}
                className="px-4 py-2 bg-[#3BA8FF]/20 text-[#3BA8FF] hover:bg-[#3BA8FF]/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold font-mono transition-colors border border-[#3BA8FF]/30"
              >
                ATIVAR (-{upgradeCostClick})
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center shrink-0">
              <Server className="w-6 h-6 text-[#FFD83D]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Fazenda de Servidores</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">Aumenta a mineração autônoma (+1/s)</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
               <span className="text-[10px] uppercase font-mono text-zinc-500">{autoBuffs.length} Ativos (1m)</span>
              <button 
                onClick={handleUpgradeAuto}
                disabled={tokens < upgradeCostAuto}
                className="px-4 py-2 bg-[#FFD83D]/20 text-[#FFD83D] hover:bg-[#FFD83D]/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold font-mono transition-colors border border-[#FFD83D]/30"
              >
                ATIVAR (-{upgradeCostAuto})
              </button>
            </div>
          </div>

          <div className="mt-8 bg-[#A5E600]/5 border border-[#A5E600]/20 rounded-2xl p-6">
            <h3 className="font-mono text-[#A5E600] text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Segurança de Nível Alfa Ativa
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Enquanto você estiver na cápsula de segurança, os fragmentos extraídos são sincronizados na rede sem perdas. Seus Bots observam seu hash rate se você melhorar muito os sistemas, interagindo de vez em quando no feed. Continue extraindo para se manter produtivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
