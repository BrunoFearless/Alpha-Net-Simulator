import { FC, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle, Clock, Zap, Cpu, Server, ShieldAlert, Check, Plus, Loader2 } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  duration: number; // in seconds
  complexity: 'Baixa' | 'Média' | 'Alta' | 'Extrema';
  status: 'available' | 'in_progress' | 'completed';
  startedAt?: number;
}

const MISSION_TEMPLATES = [
  { title: "Desfragmentar Banco de Dados", description: "Reorganize setores corrompidos no núcleo de armazenamento.", reward: 50, duration: 5, complexity: "Baixa" },
  { title: "Verificar Logs de Segurança", description: "Analise anomalias de rede no setor principal.", reward: 80, duration: 8, complexity: "Baixa" },
  { title: "Otimizar Roteamento de Nós", description: "Melhore a latência entre 5 nós da Alpha Net.", reward: 150, duration: 15, complexity: "Média" },
  { title: "Calibrar Processador Quântico", description: "Ajuste frequências para evitar sobrecarga térmica.", reward: 200, duration: 20, complexity: "Média" },
  { title: "Contenção de Intrusão (Simulada)", description: "Bloqueie um ataque DDoS de origem desconhecida.", reward: 500, duration: 40, complexity: "Alta" },
  { title: "Treinar Rede Neural Secundária", description: "Forneça datasets massivos para o Nexus Assistant.", reward: 800, duration: 60, complexity: "Alta" },
  { title: "Sincronizar Arquivos do Vazio", description: "Recupere dados perdidos em setores desconectados.", reward: 1500, duration: 120, complexity: "Extrema" },
];

export const MissionsView: FC = () => {
  const [tokens, setTokens] = useState(() => parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));
  
  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem('alpha_net_missions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleStorage = () => setTokens(parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem('alpha_net_missions', JSON.stringify(missions));
  }, [missions]);

  // Update logic for in-progress missions
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
      
      setMissions(prev => {
        let changed = false;
        const now = Date.now();
        const updated = prev.map(m => {
          if (m.status === 'in_progress' && m.startedAt) {
            const elapsed = Math.floor((now - m.startedAt) / 1000);
            if (elapsed >= m.duration) {
              changed = true;
              return { ...m, status: 'completed' as const };
            }
          }
          return m;
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateMissions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newMissions: Mission[] = [];
      const numMissions = Math.floor(Math.random() * 3) + 3; // 3 to 5
      
      for (let i = 0; i < numMissions; i++) {
        const template = MISSION_TEMPLATES[Math.floor(Math.random() * MISSION_TEMPLATES.length)];
        newMissions.push({
          id: `m_${Date.now()}_${i}`,
          title: template.title,
          description: template.description,
          reward: template.reward,
          duration: template.duration,
          complexity: template.complexity as any,
          status: 'available'
        });
      }
      
      setMissions(prev => [...newMissions, ...prev].slice(0, 10)); // keep max 10
      setIsGenerating(false);
    }, 1500); // Simulate AI generation delay
  };

  const startMission = (id: string) => {
    setMissions(prev => prev.map(m => 
      m.id === id ? { ...m, status: 'in_progress', startedAt: Date.now() } : m
    ));
  };

  const claimReward = (mission: Mission) => {
    const newTokens = tokens + mission.reward;
    setTokens(newTokens);
    localStorage.setItem('alpha_net_tokens', newTokens.toString());
    window.dispatchEvent(new Event('storage'));
    
    setMissions(prev => prev.filter(m => m.id !== mission.id));
  };

  const getComplexityColor = (c: string) => {
    switch (c) {
      case 'Baixa': return 'text-[#A5E600] border-[#A5E600]/30 bg-[#A5E600]/10';
      case 'Média': return 'text-[#3BA8FF] border-[#3BA8FF]/30 bg-[#3BA8FF]/10';
      case 'Alta': return 'text-[#FFD83D] border-[#FFD83D]/30 bg-[#FFD83D]/10';
      case 'Extrema': return 'text-[#FF4A4A] border-[#FF4A4A]/30 bg-[#FF4A4A]/10';
      default: return 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-20">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-[#B84CFF]" />
            Diretivas do Sistema
          </h1>
          <p className="text-zinc-400 font-mono mt-2 text-sm max-w-xl">
            A Inteligência Artificial Central gerou novas tarefas. Execute diretivas de rede para manter a integridade do sistema e receba Tokens Alpha como recompensa.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-1">Seu Saldo</p>
          <p className="text-2xl font-display font-bold text-[#A5E600]">{tokens.toLocaleString()} TOKENS</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Tarefas Ativas</h2>
        <button
          onClick={generateMissions}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-mono transition-colors disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {isGenerating ? 'ANALISANDO REDE...' : 'GERAR NOVAS DIRETIVAS'}
        </button>
      </div>

      <div className="space-y-4">
        {missions.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl">
            <Target className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-mono text-sm max-w-sm mx-auto">
              Nenhuma diretiva pendente no momento. Solicite novas tarefas à IA para continuar suas operações.
            </p>
          </div>
        ) : (
          missions.map(mission => {
            let progressAmount = 0;
            if (mission.status === 'in_progress' && mission.startedAt) {
              const elapsed = Math.floor((Date.now() - mission.startedAt) / 1000);
              progressAmount = Math.min((elapsed / mission.duration) * 100, 100);
            }

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border transition-all ${
                  mission.status === 'completed' 
                    ? 'bg-[#A5E600]/5 border-[#A5E600]/30 shadow-[0_0_20px_rgba(165,230,0,0.1)]' 
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-white text-lg">{mission.title}</h3>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${getComplexityColor(mission.complexity)}`}>
                        {mission.complexity}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-3">{mission.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-[#A5E600]">
                        <Zap className="w-4 h-4" />
                        Recompensa: {mission.reward} Tokens
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Clock className="w-4 h-4" />
                        Tempo estimado: {mission.duration}s
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                    {mission.status === 'available' && (
                      <button 
                        onClick={() => startMission(mission.id)}
                        className="w-full md:w-32 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs font-bold transition-colors"
                      >
                        INICIAR
                      </button>
                    )}

                    {mission.status === 'in_progress' && (
                      <div className="w-full md:w-32">
                         <div className="h-10 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden flex items-center justify-center">
                           <div 
                             className="absolute top-0 left-0 h-full bg-[#3BA8FF]/20" 
                             style={{ width: `${progressAmount}%`, transition: 'width 1s linear' }}
                           />
                           <span className="relative z-10 font-mono text-xs font-bold text-[#3BA8FF] animate-pulse">
                             EXECUTANDO...
                           </span>
                         </div>
                      </div>
                    )}

                    {mission.status === 'completed' && (
                      <button 
                        onClick={() => claimReward(mission)}
                        className="w-full md:w-32 py-2.5 rounded-lg bg-[#A5E600]/20 border border-[#A5E600]/30 hover:bg-[#A5E600]/30 text-[#A5E600] font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        COLETAR
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
