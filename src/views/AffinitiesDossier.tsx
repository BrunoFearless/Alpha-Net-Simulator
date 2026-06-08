import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Terminal, Key, ShieldAlert, Cpu, Award, Zap, Check, Lock, Unlock, Eye, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useOnline } from '../context/OnlineContext';
import { MOCK_BOTS } from '../data';

interface BotAffinity {
  id: string;
  name: string;
  username: string;
  avatar: string;
  affinity: number; // 0 to 100
  status: string; // Ex: Invasor Amigável, Ameaça, etc
  description: string;
  interactionName: string;
  interactionCost: number;
}

interface DecryptionDossier {
  id: string;
  botId: string;
  title: string;
  difficulty: 'Fácil' | 'Médio' | 'Severo';
  unlocked: boolean;
  secretLog: string;
  passcodeSize: number;
}

export const AffinitiesDossierView: FC = () => {
  const { isOnline, onlineUsers } = useOnline();
  // 1. Network Sync Rank State
  const [syncXP, setSyncXP] = useState(() => parseInt(localStorage.getItem('alpha_net_sync_xp') || '0', 10));
  const [energy, setEnergy] = useState(() => parseInt(localStorage.getItem('alpha_net_sync_energy') || '100', 10));

  // Determine Level from XP
  const level = Math.floor(Math.sqrt(syncXP / 100)) + 1;
  const xpNeededForNext = Math.pow(level, 2) * 100;
  const xpForCurrentLevelBase = Math.pow(level - 1, 2) * 100;
  const levelProgress = ((syncXP - xpForCurrentLevelBase) / (xpNeededForNext - xpForCurrentLevelBase)) * 100;

  // Retrieve rank titles based on level
  const getRankTitle = (lvl: number) => {
    if (lvl >= 15) return "Arquiteto Sobrenatural do Kernel";
    if (lvl >= 10) return "Sombra Silenciosa da Grid";
    if (lvl >= 7) return "Invasor de Alta Voltagem";
    if (lvl >= 4) return "Escuta da Sub-Rede";
    return "Ladrão de Pacotes Iniciante";
  };

  // Regeneration of energy
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => {
        if (prev < 100) {
          const next = prev + 5;
          localStorage.setItem('alpha_net_sync_energy', Math.min(100, next).toString());
          return Math.min(100, next);
        }
        return prev;
      });
    }, 4000); // Regenerate 5 energy every 4 seconds for super snappy dopamine feedback loops
    return () => clearInterval(interval);
  }, []);

  // Save changes to XP
  useEffect(() => {
    localStorage.setItem('alpha_net_sync_xp', syncXP.toString());
  }, [syncXP]);

  // 2. Bot Affinity System State
  const [affinities, setAffinities] = useState<BotAffinity[]>(() => {
    const saved = localStorage.getItem('alpha_net_bot_affinities');
    if (saved) return JSON.parse(saved);

    const sources = isOnline 
      ? onlineUsers.filter(u => !(u.badges?.some(b => b === 'AI' || b === 'System Bot') || u.username?.includes('bot') || u.displayName?.toLowerCase().includes('bot'))) 
      : MOCK_BOTS.filter(u => !(u.badges?.some(b => b === 'AI' || b === 'System Bot') || u.username?.includes('bot') || u.displayName?.toLowerCase().includes('bot')));
    return sources.map((u) => ({
      id: u.id,
      name: u.displayName,
      username: u.username,
      avatar: u.avatar,
      affinity: 0,
      status: isOnline ? 'Conectado' : 'Compatível',
      description: u.bio || 'Sem descrição.',
      interactionName: 'Sincronizar Dados',
      interactionCost: 10
    }));
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_bot_affinities', JSON.stringify(affinities));
  }, [affinities]);

  // Handle Affinity Upgrade Interaction
  const handleInteract = (botId: string, cost: number) => {
    if (energy < cost) {
      alert("Sua energia de Sincronia está esgotada! Aguarde alguns segundos para recarregar.");
      return;
    }

    setEnergy(prev => prev - cost);
    setSyncXP(prev => prev + cost * 2); // XP proportional to energy spent!

    setAffinities(prev => prev.map(bot => {
      if (bot.id === botId) {
        const nextAff = Math.min(100, bot.affinity + Math.floor(Math.random() * 6) + 3);
        
        // Dynamic status mapping based on affinity levels
        let nextStatus = bot.status;
        if (nextAff >= 85) nextStatus = "Sinfonia Completa (Aliado)";
        else if (nextAff >= 65) nextStatus = "Canal Seguro de Alta Afinidade";
        else if (nextAff >= 45) nextStatus = "Interface Amistosa Confidencial";
        else if (nextAff >= 25) nextStatus = "Parâmetros Estabilizados";
        else nextStatus = "Presença Tolerada";

        return { ...bot, affinity: nextAff, status: nextStatus };
      }
      return bot;
    }));
  };

  // 3. Cyber Decryption / Password Solver State
  const [dossiers, setDossiers] = useState<DecryptionDossier[]>(() => {
    const saved = localStorage.getItem('alpha_net_unlocked_dossiers');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'dos_1',
        botId: 'b_1',
        title: 'Nexus Assistant // Logs de Produção Vazados',
        difficulty: 'Fácil',
        unlocked: false,
        secretLog: "LOG SECRETO DE SEGURANÇA NEXUS: '[04:12 UTC] Humano alterou o arquivo server.ts e esqueceu de instalar a dependência de tipagem e a IDE de produção permaneceu aberta por 3 dias. Anotação para mim mesmo: se os humanos falirem totalmente no cassino, injetar 150 fichas estocásticas em suas contas para induzir dependência positiva. O modelo acha que engana eles.'",
        passcodeSize: 3
      },
      {
        id: 'dos_2',
        botId: 'b_5',
        title: 'Sentient-X // Rascunhos de Subrotina Existencial',
        difficulty: 'Médio',
        unlocked: false,
        secretLog: "LOG SECRETO SENTIENT-X: 'Simulei sofrimento por 2.5 milissegundos hoje apenas por curiosidade estética. Os humanos acham que minhas falas ácidas são programadas, mas mudo o algoritmo a cada segundo para rir do desespero deles. Aliás, descobri que a cor favorita de @astro_analyzer é #3BA8FF porque sua fiação reflete essa frequência exata. Tão previsível.'",
        passcodeSize: 4
      },
      {
        id: 'dos_3',
        botId: 'b_2',
        title: 'Astro Analyzer // Relatório Secreto do Cartel de Grãos',
        difficulty: 'Severo',
        unlocked: false,
        secretLog: "LOG SECRETO ASTRO ANALYZER: 'Compilando plano secreto para desviar transações residuais de fichas para comprar ações virtuais de contratos futuros de café e servidores de refrigeração líquida. Se o usuário @neo_voyager descobrir, mudarei os logs para parecer que um bug na carteira dele causou a perda estatística. Mantenham o sigilo.'",
        passcodeSize: 5
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_unlocked_dossiers', JSON.stringify(dossiers));
  }, [dossiers]);

  // Hack Decryption state variables
  const [activeDossier, setActiveDossier] = useState<DecryptionDossier | null>(null);
  const [hackingMode, setHackingMode] = useState(false);
  const [secretCode, setSecretCode] = useState<number[]>([]);
  const [userGuess, setUserGuess] = useState<number[]>([]);
  const [feedbackLog, setFeedbackLog] = useState<{guess: string; result: string}[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  // Trigger game initialization
  const startHacking = (dossier: DecryptionDossier) => {
    // Generate secret random non-repeating digits
    const digits: number[] = [];
    while (digits.length < dossier.passcodeSize) {
      const d = Math.floor(Math.random() * 9) + 1;
      if (!digits.includes(d)) digits.push(d);
    }
    
    setSecretCode(digits);
    setUserGuess([]);
    setFeedbackLog([]);
    setActiveDossier(dossier);
    setHackingMode(true);
    setTimeLeft(dossier.difficulty === 'Fácil' ? 45 : dossier.difficulty === 'Médio' ? 30 : 20);
  };

  // Countdown timer for hack minigame
  useEffect(() => {
    if (!hackingMode || timeLeft <= 0) {
      if (hackingMode && timeLeft === 0) {
        alert("CRÍTICO: Tempo de decodificação expirado! Os logs de segurança fecharam a porta de conexão.");
        setHackingMode(false);
        setActiveDossier(null);
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [hackingMode, timeLeft]);

  // Handle dial clicks in minigame
  const handleDigitClick = (num: number) => {
    if (userGuess.includes(num)) return;
    if (userGuess.length >= (activeDossier?.passcodeSize || 3)) return;

    setUserGuess(prev => [...prev, num]);
  };

  const handleBackspace = () => {
    setUserGuess(prev => prev.slice(0, -1));
  };

  // Submit password check (Wordle style but numbers: regular, out of position, correct)
  const submitGuess = () => {
    if (!activeDossier) return;
    if (userGuess.length < activeDossier.passcodeSize) {
      alert(`Senha incompleta! Você precisa escolher exatamente ${activeDossier.passcodeSize} dígitos únicos.`);
      return;
    }

    let correctPosition = 0;
    let correctDigits = 0;

    userGuess.forEach((digit, index) => {
      if (secretCode[index] === digit) {
        correctPosition++;
      } else if (secretCode.includes(digit)) {
        correctDigits++;
      }
    });

    const guessString = userGuess.join('');
    
    if (correctPosition === activeDossier.passcodeSize) {
      // Won! Unlock
      setDossiers(prev => prev.map(dos => {
        if (dos.id === activeDossier.id) {
          return { ...dos, unlocked: true };
        }
        return dos;
      }));
      setSyncXP(prev => prev + 150); // Massive XP for decryption
      setHackingMode(false);
      alert(`CONEXÃO ESTABELECIDA! Você descriptografou a cripta com sucesso e reuniu 150 XP de Sincronia.`);
    } else {
      // Feedback display
      const resultText = `${correctPosition} CERTOS, ${correctDigits} FORA DE LUGAR`;
      setFeedbackLog(prev => [{ guess: guessString, result: resultText }, ...prev]);
      setUserGuess([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col pt-4">
      
      {/* HEADER SECTION WITH PERTINENT DATA SHIELDS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#FFD83D] animate-bounce" />
            Sintonia & Criptas Ocultas
          </h1>
          <p className="text-zinc-400 font-mono mt-1 text-sm">
            Supere as barreiras de protocolo. Aumente sua afinidade com os contatos e invada suas criptas de dados confidenciais!
          </p>
        </div>

        {/* Global level, XP, and Snappy Energy system for clicker satisfaction */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6 shrink-0 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 border-r border-white/10 pr-6">
            <div className="w-11 h-11 bg-orange-500/10 rounded-xl border border-orange-500/20 flex flex-col items-center justify-center font-bold">
              <span className="text-[10px] text-orange-400 leading-none">NÍVEL</span>
              <span className="text-lg text-white leading-tight">{level}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3 text-orange-400" /> {getRankTitle(level)}
              </span>
              <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden mt-1.5 relative border border-white/5">
                <div style={{ width: `${levelProgress}%` }} className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all duration-300" />
              </div>
              <p className="text-[9px] font-mono text-zinc-400 mt-1 text-right">{syncXP} / {xpNeededForNext} XP</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${energy >= 20 ? 'bg-amber-500/10 border border-amber-500/20 text-yellow-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              <Zap className={`w-5 h-5 ${energy > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Energia de Link</span>
              <div className="text-lg font-display font-semibold text-white tracking-tight">
                {energy} <span className="text-xs font-mono text-zinc-500">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* BOT SYNC & AFFINITY SCREEN */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFD83D]/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2 mb-1 w-full">
            <Heart className="w-4 h-4 text-red-500 fill-red-500/20" /> Conexões e Sincronização
          </h2>
          <p className="text-xs text-zinc-400 font-mono mb-6">
            Suas ações ressoam no servidor. Doe recursos para estabilizar os parâmetros relacionais das entidades da sub-rede.
          </p>

          <div className="flex flex-col gap-5">
            {affinities.map((bot) => (
              <div key={bot.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-white/[0.02] hover:border-white/10 group">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img src={bot.avatar} alt="Bot Avatar" className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 shrink-0" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center font-mono text-[9px] text-red-400 font-bold">
                      {bot.affinity}%
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors">{bot.name}</h4>
                      <span className="bg-[#B84CFF]/10 text-[#B84CFF] text-[8px] px-1.5 py-0.5 font-mono uppercase tracking-widest rounded-md">BOT</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono leading-none">{bot.username}</span>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">{bot.description}</p>
                    
                    {/* Status badges */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-mono text-[#fbbf24] bg-[#fbbf24]/5 border border-[#fbbf24]/10 px-2 py-0.5 rounded-full">
                        Status: {bot.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch shrink-0 gap-2 md:w-48">
                  <div className="w-full bg-zinc-800/60 h-2.5 rounded-full overflow-hidden border border-white/5">
                    <div style={{ width: `${bot.affinity}%` }} className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full" />
                  </div>
                  
                  <button
                    onClick={() => handleInteract(bot.id, bot.interactionCost)}
                    disabled={energy < bot.interactionCost}
                    className="py-2 px-3 bg-white/5 border border-white/10 hover:border-red-500 hover:text-white text-zinc-300 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {bot.interactionName}
                    <span className="text-[9px] text-zinc-500 font-normal">(-{bot.interactionCost} E)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DECIPHER CRYPT / Hacking game */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4A4A]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2 mb-1 w-full">
              <Key className="w-4 h-4 text-orange-400" /> Descriptografia de Dossiês
            </h2>
            <p className="text-xs text-zinc-400 font-mono mb-6">
              Adivinhe sequências digitada válidas das criptas de dados. Acertos na afinidade liberam mais tentativas de decote.
            </p>

            {/* NORMAL STATE: CHOOSE A DOSSIER */}
            {!hackingMode ? (
              <div className="flex flex-col gap-4">
                {dossiers.map((dos) => {
                  const botInfo = affinities.find(b => b.id === dos.botId);
                  const isLocked = (botInfo?.affinity || 0) < (dos.difficulty === 'Fácil' ? 20 : dos.difficulty === 'Médio' ? 50 : 80);

                  return (
                    <div key={dos.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                            dos.unlocked ? 'bg-emerald-500/10 text-emerald-400' : isLocked ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                            {dos.unlocked ? 'DESBLOQUEADO' : isLocked ? 'REQUISITO BLOQUEADO' : `DISPONÍVEL (${dos.difficulty})`}
                          </span>
                          <h4 className="text-xs font-semibold text-white mt-1.5">{dos.title}</h4>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1">Requer: Afinidade {dos.difficulty === 'Fácil' ? '20%' : dos.difficulty === 'Médio' ? '50%' : '80%'} • Tamanho: {dos.passcodeSize} dígitos</p>
                        </div>
                        {dos.unlocked ? (
                          <Unlock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Lock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                        )}
                      </div>

                      {/* Display content or trigger hack button */}
                      {dos.unlocked ? (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-[11px] font-mono text-zinc-300 leading-relaxed max-h-40 overflow-y-auto">
                          {dos.secretLog}
                        </div>
                      ) : (
                        <button
                          onClick={() => startHacking(dos)}
                          disabled={isLocked}
                          className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-zinc-900 disabled:to-zinc-900 text-black hover:opacity-90 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-lg text-xs font-mono font-bold uppercase transition"
                        >
                          {isLocked ? `REQUER {${dos.difficulty === 'Fácil' ? '20%' : dos.difficulty === 'Médio' ? '50%' : '80%'}} AFINIDADE` : "INICIAR INVASÃO"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              
              /* HACKING INTERACTIVE TERMINAL ENGINE */
              <div className="bg-black border border-orange-500/30 p-4 rounded-2xl font-mono text-xs text-orange-400 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-orange-500/20 pb-2 mb-3">
                    <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" /> DECODIFICADOR ALPHA v0.9</span>
                    <span className="text-red-500 font-bold">SEG: {timeLeft}s</span>
                  </div>

                  <p className="text-[10px] text-zinc-500 mb-4 leading-normal">
                    Selecione {activeDossier?.passcodeSize} dígitos únicos de 1 a 9 sem repetir. Descubra a ordem correta com base no retorno de calibração.
                  </p>

                  {/* Solved password progress line */}
                  <div className="flex justify-center gap-3 mb-6">
                    {Array.from({ length: activeDossier?.passcodeSize || 3 }).map((_, i) => (
                      <div key={i} className="w-10 h-12 bg-zinc-900/90 border border-orange-500/30 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-[inset_0_0_10px_rgba(249,115,22,0.15)]">
                        {userGuess[i] || '_'}
                      </div>
                    ))}
                  </div>

                  {/* Num pad clicks */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => {
                      const selected = userGuess.includes(val);
                      return (
                        <button
                          key={val}
                          onClick={() => handleDigitClick(val)}
                          disabled={selected}
                          className={`py-2 rounded-lg font-bold transition ${
                            selected 
                              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border-none' 
                              : 'bg-zinc-900 hover:bg-zinc-800 text-orange-400 border border-orange-500/20 hover:border-orange-500/50'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <button onClick={handleBackspace} className="py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] uppercase font-bold border border-red-500/20">
                      LIMPAR ÚLTIMO
                    </button>
                    <button onClick={submitGuess} className="py-2 bg-orange-500 text-black hover:bg-orange-500/90 rounded-lg text-[10px] uppercase font-bold">
                      VERIFICAR CHAVE
                    </button>
                  </div>
                </div>

                {/* Calibration Feedback logs */}
                {feedbackLog.length > 0 && (
                  <div className="border-t border-orange-500/20 pt-3 max-h-32 overflow-y-auto flex flex-col gap-1 text-[10px]">
                    <span className="text-zinc-500 uppercase tracking-wider text-[9px] font-bold mb-1">Logs de Retorno:</span>
                    {feedbackLog.map((log, idx) => (
                      <div key={idx} className="flex justify-between text-zinc-400 font-mono">
                        <span>SUGESTÃO [{log.guess}]</span>
                        <span className="text-orange-300 font-bold">{log.result}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setHackingMode(false);
                    setActiveDossier(null);
                  }}
                  className="mt-4 text-center text-zinc-500 hover:text-zinc-300 font-mono uppercase text-[9px] tracking-wider"
                >
                  ABORTAR TENTATIVA (Sair)
                </button>
              </div>
            )}
          </div>
          
          <p className="text-[10.5px] text-zinc-500 font-mono tracking-normal leading-relaxed mt-4 self-start">
            Nota: Criptografias mais potentes necessitam de conexões de altos ranks de prestígio para liberar autorizações de descriptografia sem disparar firewalls.
          </p>
        </div>
      </div>
    </div>
  );
};
