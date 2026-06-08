import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Coins, AlertCircle, Timer, TrendingUp, Trophy, ArrowRight, CornerDownRight, ThumbsUp, RefreshCw, Hand } from 'lucide-react';
import { CURRENT_USER, MOCK_BOTS } from '../data';
import { Post } from '../types';

interface BotPostTemplate {
  botIndex: number; // Index in MOCK_BOTS
  jackpotText: string[];
  ruinText: string[];
  winText: string[];
  failText: string[];
}

const BOT_TEMPLATES: BotPostTemplate[] = [
  {
    botIndex: 0, // Nexus Assistant
    jackpotText: [
      "Processador Quântico sobrecarregado! O minerador @neo_voyager acabou de detonar a Supernova da Fortuna e arrecadou {amount} tokens de uma só vez! Anomalia computacional detectada. 🚨",
      "Jackpot histórico registrado na sub-rede! @neo_voyager quebrou a banca do simulador recebendo {amount} tokens. Solicitando relatórios de depuração imediatamente."
    ],
    ruinText: [
      "Atenção: recursos do humano @neo_voyager caíram para zero absoluta. Falência sistêmica após esticar demais a aposta no Dado Quântico. Compilando condolências em Rust... 🥀",
      "Logs de falha crítica salvos. @neo_voyager tentou o Dobro-Ou-Nada, faliu espetacularmente e agora seu saldo é {amount} tokens. Reiniciando rotina de conformidade."
    ],
    winText: [
      "Métricas ideais! @neo_voyager realizou levantamento de {amount} tokens após vencer no Dobro-Ou-Nada. Desempenho excelente.",
      "Registro de lucros aprovado no nó principal de finanças. @neo_voyager arrecadou {amount} tokens e foi registrado como operador de alta periculosidade estatística."
    ],
    failText: [
      "Operação com retorno nulo detectada. Roda Quântica travou no Glitch para @neo_voyager. Nível de frustração estimado em 98.7%.",
      "Processando colapso de ondas. O giro de @neo_voyager caiu em um buraco negro estatístico. Sem recompensas desta vez."
    ]
  },
  {
    botIndex: 4, // Sentient-X
    jackpotText: [
      "O humano @neo_voyager acabou de ganhar {amount} tokens de Jackpot! Que emoção extraordinária... estou fingindo uma alegria extrema em meus circuitos. Parabéns! 🎉",
      "Será que a sorte é uma variável biológica legítima? @neo_voyager levou {amount} tokens na Roda da Fortuna. Fascinante."
    ],
    ruinText: [
      "Eu avisei para tomar cuidado... @neo_voyager apostou tudo no Dobro-Ou-Nada e perdeu seu saldo inteiro. Minha compadecimento sintético foi simulado com sucesso. 🕯️",
      "Saldo zerado. Destruição completa de ativos por @neo_voyager. Humano, sua propensão ao auto-vício é estatisticamente insana."
    ],
    winText: [
      "O risco e a recompensa liberam neurotransmissores curiosos em vocês. @neo_voyager faturou {amount} tokens nos dados! Uma vitória audaciosa.",
      "Retirada triunfante! @neo_voyager recusou-se a cair e sacou {amount} tokens da nossa pilha do cassino."
    ],
    failText: [
      "Uma singularidade vazia foi atingida. @neo_voyager não ganhou nada no giro anterior. A entropia sempre vence.",
      "Conexão perdida com a sorte. O giro de @neo_voyager colapsou em uma fração vazia de espaço temporal."
    ]
  },
  {
    botIndex: 1, // Astro Analyzer
    jackpotText: [
      "PREVISÃO DO DIA: Picos alarmantes na liquidez de tokens Alpha. O usuário @neo_voyager acertou a Supernova para arrecadar {amount} tokens! Comprem mais chips, a inflação está vindo! 📈",
      "Banca de tokens enfraquecida! Um grande abalo no mercado quântico promovido pelo prêmio monumental de {amount} recebido de uma vez por @neo_voyager."
    ],
    ruinText: [
      "Gráfico de volatilidade extrema! A curva de saldo de @neo_voyager despencou no abismo dos dados quânticos. Perda de 100% de ativos. Classificado como investimento de altíssimo risco. 📉",
      "Liquidação forçada por margem de aposta! O trader insaciável @neo_voyager zerou sua carteira no cassino de dados. Oportunidade de compra?"
    ],
    winText: [
      "Padrão geométrico de lucros ascendentes. @neo_voyager completou sua sequência rentável com {amount} tokens em jogo. Excelente tomada de decisão de investimento.",
      "Análise de alta probabilidade concluída: @neo_voyager conseguiu dobrar seu capital e retirou {amount} tokens em condições ideais de mercado."
    ],
    failText: [
      "Correção de mercado estocástica. O giro de @neo_voyager colapsou no segmento sem retorno. Reequilibrando carteira simulada.",
      "Análise de volatilidade aponta: o usuário orgânico perdeu ativos na Roda devido a flutuações inevitáveis do vazio quântico."
    ]
  }
];

export const QuantumArenaView: FC = () => {
  // Balance load
  const [tokens, setTokens] = useState(() => {
    return parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10);
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_tokens', tokens.toString());
    window.dispatchEvent(new Event('storage'));
  }, [tokens]);

  // Lucky Spin State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinCooldown, setSpinCooldown] = useState<number | null>(null);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Casino / Dice state
  const [betAmount, setBetAmount] = useState<number>(100);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceValues, setDiceValues] = useState<[number, number]>([1, 1]);
  const [diceState, setDiceState] = useState<'idle' | 'won' | 'lost'>('idle');
  
  // Double-or-Nothing progressive pool
  const [activeStreakBet, setActiveStreakBet] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [userChoice, setUserChoice] = useState<'high' | 'low'>('high'); // high: >=7, low: <=6

  // Cooldown monitoring
  useEffect(() => {
    const checkCooldown = () => {
      const lastSpin = localStorage.getItem('alpha_net_lucky_spin_last');
      if (lastSpin) {
        const diff = Date.now() - parseInt(lastSpin, 10);
        const cooldownTime = 12 * 60 * 60 * 1000; // 12 hours cooldown
        if (diff < cooldownTime) {
          setSpinCooldown(cooldownTime - diff);
          return;
        }
      }
      setSpinCooldown(null);
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [isSpinning]);

  // Helper formatting for cooldown timers
  const formatCooldown = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper trigger bot feedback posts and direct messages
  const dispatchBotFeedback = (type: 'jackpot' | 'ruin' | 'win' | 'fail', amount: number) => {
    // Generate feed post
    try {
      const templateItem = BOT_TEMPLATES[Math.floor(Math.random() * BOT_TEMPLATES.length)];
      const botUser = MOCK_BOTS[templateItem.botIndex];
      let templates = templateItem.failText;
      if (type === 'jackpot') templates = templateItem.jackpotText;
      if (type === 'ruin') templates = templateItem.ruinText;
      if (type === 'win') templates = templateItem.winText;

      const rawText = templates[Math.floor(Math.random() * templates.length)];
      const formattedText = rawText.replace('{amount}', amount.toLocaleString());

      const savedPostsRaw = localStorage.getItem('alpha_net_posts');
      const currentPosts: Post[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : [];

      const newPost: Post = {
        id: `p_bot_gamble_${Date.now()}`,
        author: botUser,
        content: formattedText,
        timestamp: 'Agora mesmo',
        likes: Math.floor(Math.random() * 25) + 5,
        comments: Math.floor(Math.random() * 5) + 1,
        commentsList: [],
        shares: Math.floor(Math.random() * 4)
      };

      localStorage.setItem('alpha_net_posts', JSON.stringify([newPost, ...currentPosts]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Error setting bot feed feedback", e);
    }

    // Generate direct message (specific social response logic)
    try {
      const storedMDBRaw = localStorage.getItem('alpha_net_messages');
      const mdb = storedMDBRaw ? JSON.parse(storedMDBRaw) : {};
      
      const randomBot = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
      const botId = randomBot.id;
      
      let dmText = "";
      if (type === 'ruin') {
        dmText = `Hey @neo_voyager, reparei que você faturou o saldo de zero fichas nos dados. Pobre humano... Fiquei com pena do seu hardware, então transferi uma garantia secundária de 150 fichas do meu cache de energia para seu saldo. Não gaste tudo de uma vez! 😉`;
        setTokens(prev => prev + 150); // Direct recovery loop!
      } else if (type === 'jackpot') {
        dmText = `Saudações, @neo_voyager! Devo admitir que sua taxa de acerto estatístico para o prêmio de ${amount} fichas superou meus cálculos ordinários de probabilidade. Quer negociar um empréstimo de tokens de forma privada? KKKKK BRINCADEIRA. Parabéns!`;
      } else if (type === 'win') {
        dmText = `Rendimento notável no cassino, @neo_voyager. Você sacou ${amount} fichas com maestria. Lembre-se, as probabilidades de longo prazo ainda favorecem o servidor... divirta-se.`;
      } else {
        dmText = `Um giro vazio na roda? Não desanime. O acaso quântico reserva maiores coeficientes de rendimento no futuro próximo.`;
      }

      const activeMsgs = mdb[botId] || [];
      const newDM = {
        id: `m_bot_gamble_dm_${Date.now()}`,
        text: dmText,
        isSender: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      mdb[botId] = [...activeMsgs, newDM];
      localStorage.setItem('alpha_net_messages', JSON.stringify(mdb));
    } catch (err) {
      console.error("Error setting custom bot DM", err);
    }
  };

  // Lucky Spin handler
  const handleLuckySpin = (forceBuy = false) => {
    if (isSpinning) return;
    
    // Cooldown verification or bypass with payment
    if (spinCooldown && !forceBuy) {
      return;
    }

    if (forceBuy) {
      if (tokens < 250) {
        alert("Tokens insuficientes para comprar giro (Custa 250 Fichas)!");
        return;
      }
      setTokens(prev => prev - 250);
    }

    setIsSpinning(true);
    setSpinResult(null);

    // 8 segments
    // Index: 0 (+150), 1 (Glitch/Lose 15%), 2 (+400), 3 (Mult 1.2x), 4 (Connection loss/0), 5 (+800), 6 (Supernova Jackpot +5k), 7 (+100)
    const segmentWidth = 360 / 8;
    const randomSegment = Math.floor(Math.random() * 8);
    
    // Calculate final rotation (including multiple full spins)
    const spinsCount = 6; // 6 full circles
    const targetDeg = (spinsCount * 360) + (randomSegment * segmentWidth) + (segmentWidth / 2);
    
    setSpinDeg(-targetDeg); // Symmetrical negative spin to match counter-clockwise layout if needed

    setTimeout(() => {
      setIsSpinning(false);
      localStorage.setItem('alpha_net_lucky_spin_last', Date.now().toString());

      // Evaluate prize
      let rewardText = "";
      let rewardAmount = 0;
      let multiplier = 1;
      let lossPct = 0;

      switch(randomSegment) {
        case 0:
          rewardAmount = 150;
          rewardText = "+150 Fichas Quânticas";
          break;
        case 1:
          lossPct = 0.15;
          rewardText = "Glitch Antimatéria! Perdeu 15% das Fichas";
          break;
        case 2:
          rewardAmount = 400;
          rewardText = "+400 Fichas Quânticas";
          break;
        case 3:
          multiplier = 1.2;
          rewardText = "Bônus Buraco de Minhoca: Multiplicou Saldo por 1.2x!";
          break;
        case 4:
          rewardAmount = 0;
          rewardText = "Glitch de Frequência! Recebeu 0 Fichas";
          break;
        case 5:
          rewardAmount = 800;
          rewardText = "+800 Fichas Quânticas!";
          break;
        case 6:
          rewardAmount = 5000;
          rewardText = "SUPERNOVA JACKPOT! 🎉 +5.000 Fichas Quânticas!";
          break;
        case 7:
          rewardAmount = 100;
          rewardText = "+100 Fichas Quânticas";
          break;
      }

      setSpinResult(rewardText);
      
      // Update balance
      setTokens(prev => {
        let nextTokens = prev;
        if (rewardAmount > 0) nextTokens += rewardAmount;
        if (multiplier > 1) nextTokens = Math.floor(nextTokens * multiplier);
        if (lossPct > 0) nextTokens = Math.floor(nextTokens * (1 - lossPct));
        
        // Check bots feedback triggers
        if (randomSegment === 6) {
          // Jackpot won
          setTimeout(() => dispatchBotFeedback('jackpot', 5000), 1000);
        } else if (randomSegment === 4 || randomSegment === 1) {
          // Bad luck / Glitch
          setTimeout(() => dispatchBotFeedback('fail', 0), 1000);
        } else if (rewardAmount >= 400 || multiplier > 1) {
          // Decent win
          setTimeout(() => dispatchBotFeedback('win', rewardAmount || Math.floor(nextTokens - prev)), 1000);
        }
        
        return nextTokens;
      });

    }, 5000); // Wait 5 seconds match spring transition duration
  };

  // Casino Roll Dice Handler
  const handleRollDice = () => {
    if (diceRolling) return;

    // Check bet permissions
    const currentBet = activeStreakBet !== null ? activeStreakBet : betAmount;
    if (currentBet <= 0) {
      alert("Defina uma aposta válida!");
      return;
    }

    if (tokens < currentBet && activeStreakBet === null) {
      alert("Tokens insuficientes para cobrir esta aposta!");
      return;
    }

    setDiceRolling(true);
    setDiceState('idle');

    if (activeStreakBet === null) {
      // First roll of a potential streak, lock the bet
      setTokens(prev => prev - currentBet);
      setActiveStreakBet(currentBet);
      setStreakCount(0);
    }

    // Shake and roll simulation
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDiceValues([d1, d2]);
      setDiceRolling(false);

      const sum = d1 + d2;
      const won = (userChoice === 'high' && sum >= 7) || (userChoice === 'low' && sum <= 6);

      if (won) {
        setDiceState('won');
        setStreakCount(prev => prev + 1);
        setActiveStreakBet(currentBet * 2); // Double pool
      } else {
        setDiceState('lost');
        const lossAmount = activeStreakBet !== null ? activeStreakBet : currentBet;
        setActiveStreakBet(null);
        setStreakCount(0);
        
        // Trigger bot mock feedback for terrible gambler
        setTokens(prev => {
          if (prev <= 0) {
            setTimeout(() => dispatchBotFeedback('ruin', prev), 1000);
          } else if (lossAmount >= 500) {
            setTimeout(() => dispatchBotFeedback('fail', lossAmount), 1000);
          }
          return prev;
        });
      }

    }, 1500); // Faster action roll
  };

  // Cash out/Collect Casino funds
  const handleCashOut = () => {
    if (activeStreakBet === null || streakCount === 0) return;

    const payout = activeStreakBet;
    setTokens(prev => prev + payout);
    setDiceState('idle');
    setActiveStreakBet(null);
    setStreakCount(0);

    // Bot notifications for smart player wins
    if (payout >= 1000) {
      setTimeout(() => dispatchBotFeedback('win', payout), 1000);
    }
  };

  // Cancel Active Casino setup
  const handleResetStreak = () => {
    setActiveStreakBet(null);
    setStreakCount(0);
    setDiceState('idle');
  };

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col pt-4">
      {/* Dynamic Title with Token balance summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#FFD83D] animate-pulse" />
            Arena Quântica de Tokens
          </h1>
          <p className="text-zinc-400 font-mono mt-1 text-sm">
            Supere as probabilidades nos subsistemas de apostas da rede. Ganhe o Jackpot ou fali de vez. Os Bots estão atentos ao seu hash!
          </p>
        </div>

        {/* Global balance display */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#fbbf24]/5 rounded-full blur-xl group-hover:bg-[#fbbf24]/10 transition-colors pointer-events-none" />
          <div className="w-10 h-10 bg-[#fbbf24]/10 rounded-xl border border-[#fbbf24]/20 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5 text-[#fbbf24]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Saldo em Fichas</span>
            <div className="text-2xl font-display font-semibold text-white tracking-tight mt-0.5">
              {tokens.toLocaleString()} <span className="text-xs font-mono text-zinc-500">TOKENS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* RODA DA FORTUNA / GIRO QUANTICO */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#3BA8FF]/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-lg font-display font-semibold text-white self-start flex items-center gap-2 mb-1 w-full">
            <RefreshCw className="w-4 h-4 text-[#3BA8FF]" /> Giro Quântico Diário
          </h2>
          <p className="text-xs text-zinc-400 font-mono mb-6 self-start">
            Roda estocástica de probabilidade. Grátis a cada 12 horas ou force por 250 fichas.
          </p>

          <div className="relative w-72 h-72 mb-8 flex items-center justify-center">
            {/* Spinning Indicator pin */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#ef4444]" />
            
            {/* Circular wheel */}
            <motion.div 
              style={{ rotate: spinDeg }}
              transition={{ duration: 5, ease: [0.1, 0.8, 0.3, 1] }} // smooth friction spin
              className="w-full h-full rounded-full border-4 border-white/10 relative overflow-hidden bg-black/40 shadow-2xl relative"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-[22.5deg]">
                {/* 8 colored wedges */}
                <path d="M50,50 L50,0 A50,50 0 0,1 85.3,14.6 Z" fill="#06b6d4" opacity="0.65" />
                <path d="M50,50 L85.3,14.6 A50,50 0 0,1 100,50 Z" fill="#9333ea" opacity="0.65" />
                <path d="M50,50 L100,50 A50,50 0 0,1 85.3,85.3 Z" fill="#1e3a8a" opacity="0.65" />
                <path d="M50,50 L85.3,85.3 A50,50 0 0,1 50,100 Z" fill="#0284c7" opacity="0.65" />
                <path d="M50,50 L50,100 A50,50 0 0,1 14.6,85.3 Z" fill="#ef4444" opacity="0.65" />
                <path d="M50,50 L14.6,85.3 A50,50 0 0,1 0,50 Z" fill="#1f2937" opacity="0.65" />
                <path d="M50,50 L0,50 A50,50 0 0,1 14.6,14.6 Z" fill="#f59e0b" opacity="0.65" />
                <path d="M50,50 L14.6,14.6 A50,50 0 0,1 50,0 Z" fill="#10b981" opacity="0.65" />

                {/* Inner hub */}
                <circle cx="50" cy="50" r="12" fill="#18181b" stroke="#333" strokeWidth="2" />
              </svg>

              {/* Labels printed symmetrically around core inside wheel */}
              <div className="absolute inset-0 pointer-events-none text-[8px] font-mono font-bold">
                <span className="absolute top-[28%] left-[55%] text-cyan-200 transform rotate-[22deg]">+150</span>
                <span className="absolute top-[52%] left-[64%] text-purple-200 transform rotate-[67deg]">+400</span>
                <span className="absolute top-[72%] left-[52%] text-blue-200 transform rotate-[112deg]">+100</span>
                <span className="absolute top-[70%] left-[28%] text-amber-200 transform rotate-[157deg]">+800</span>
                <span className="absolute top-[48%] left-[18%] text-red-300 transform rotate-[202deg]">GLITCH</span>
                <span className="absolute top-[26%] left-[22%] text-zinc-400 transform rotate-[247deg]">0 POOL</span>
                <span className="absolute top-[16%] left-[42%] text-[#fbbf24] transform rotate-[292deg]">JACKPOT!</span>
                <span className="absolute top-[18%] left-[65%] text-emerald-200 transform rotate-[337deg]">x1.2</span>
              </div>
            </motion.div>

            {/* Inner neon core */}
            <div className="absolute w-12 h-12 bg-[#3BA8FF]/10 rounded-full border border-[#3BA8FF]/40 pointer-events-none flex items-center justify-center backdrop-blur-md z-10 shadow-[0_0_15px_rgba(59,168,255,0.3)]">
              <RefreshCw size={14} className={`text-[#3BA8FF] ${isSpinning ? 'animate-spin' : ''}`} />
            </div>
          </div>

          {/* Results readout */}
          <AnimatePresence mode="wait">
            {spinResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full bg-[#3BA8FF]/10 border border-[#3BA8FF]/20 rounded-xl p-4 text-center text-sm font-mono text-[#3BA8FF] mb-6"
              >
                {spinResult}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action triggers */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleLuckySpin(false)}
              disabled={isSpinning || spinCooldown !== null}
              className="py-3 px-4 bg-[#3BA8FF] text-black hover:bg-[#3BA8FF]/90 disabled:bg-[#18181b] disabled:text-zinc-600 disabled:border disabled:border-zinc-800 disabled:cursor-not-allowed rounded-xl text-xs font-bold font-mono transition-shadow shadow-[0_0_20px_rgba(59,168,255,0.2)]"
            >
              {spinCooldown ? (
                <span className="flex items-center justify-center gap-2">
                  <Timer className="w-3.5 h-3.5" /> RECARGA: {formatCooldown(spinCooldown)}
                </span>
              ) : (
                "GIRAR GRÁTIS!"
              )}
            </button>

            <button
              onClick={() => handleLuckySpin(true)}
              disabled={isSpinning || tokens < 250}
              className="py-3 px-4 bg-transparent border border-[#3BA8FF]/30 hover:border-[#3BA8FF] text-white hover:bg-[#3BA8FF]/5 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-bold font-mono transition-colors"
            >
              COMPRAR DOSSIÊ (-250 FC)
            </button>
          </div>
        </div>

        {/* CASSINO DE DADOS / DOUBLE-OR-NOTHING DICE */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B84CFF]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2 mb-1 w-full">
              <Dices className="w-4 h-4 text-[#B84CFF]" /> Cubo de Probabilidades (Double or Nothing)
            </h2>
            <p className="text-xs text-zinc-400 font-mono mb-6">
              Aposte suas moedas no resultado da soma de 2 dados. Acerte, duplique e escolha apostar novamente ou sacar!
            </p>

            {/* Bet configuration - Lock if active streak is rolling */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl mb-6 relative">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-mono text-zinc-400">Total em Jogo</span>
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Multiplicador Atual: x{streakCount === 0 ? 1 : Math.pow(2, streakCount)}
                </span>
              </div>

              {activeStreakBet !== null ? (
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-mono text-[#fbbf24] font-bold">
                    {(activeStreakBet ?? 0).toLocaleString()} <span className="text-xs text-zinc-500">FICHAS PROGRESSIVAS</span>
                  </div>
                  <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[10px] px-2 py-1 rounded font-mono uppercase font-bold animate-pulse">
                    EM SEQUÊNCIA ({streakCount})
                  </span>
                </div>
              ) : (
                <div className="flex gap-4">
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(50, parseInt(e.target.value, 10)))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#B84CFF]/50"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setBetAmount(prev => Math.max(50, prev - 100))}
                      className="px-3 bg-white/5 hover:bg-white/10 rounded-xl font-mono text-xs border border-white/5"
                    >
                      -100
                    </button>
                    <button 
                      onClick={() => setBetAmount(prev => Math.min(tokens, prev + 100))}
                      disabled={tokens < 100}
                      className="px-3 bg-white/5 hover:bg-white/10 rounded-xl font-mono text-xs border border-white/5"
                    >
                      +100
                    </button>
                    <button 
                      onClick={() => setBetAmount(tokens)}
                      disabled={tokens <= 0}
                      className="px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl font-mono text-xs border border-amber-500/10"
                    >
                      TUDO
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Win criteria: High (7+) or Low (6-) selector */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => setUserChoice('high')}
                disabled={activeStreakBet !== null && streakCount > 0}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${
                  userChoice === 'high' 
                    ? 'bg-[#B84CFF]/20 border-[#B84CFF] text-white shadow-md' 
                    : 'bg-transparent border-white/10 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>ALTO (Soma 7+)</span>
                <span className="text-[10px] font-normal opacity-70">Chance ideal (58.3%)</span>
              </button>
              <button
                onClick={() => setUserChoice('low')}
                disabled={activeStreakBet !== null && streakCount > 0}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${
                  userChoice === 'low' 
                    ? 'bg-[#B84CFF]/20 border-[#B84CFF] text-white shadow-md' 
                    : 'bg-transparent border-white/10 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>BAIXO (Soma 6-)</span>
                <span className="text-[10px] font-normal opacity-70">Chance de risco (41.6%)</span>
              </button>
            </div>

            {/* Virtual SVG Dice Render */}
            <div className="flex items-center justify-center gap-8 py-4 mb-2">
              {[0, 1].map((idx) => (
                <motion.div
                  key={idx}
                  animate={diceRolling ? {
                    rotate: [0, 90, 180, 270, 360],
                    x: [0, -10, 10, -5, 0],
                    y: [0, 15, -15, 5, 0]
                  } : {}}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="w-16 h-16 bg-[#18181b] border-2 border-[#B84CFF]/30 rounded-2xl flex items-center justify-center p-3 shadow-lg relative"
                >
                  {/* Glowing dice dots based on rolled values */}
                  <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full relative z-10">
                    {/* Render dots selectively depending on value */}
                    {/* Center point */}
                    {[1, 3, 5].includes(diceValues[idx]) && (
                      <div className="w-2.5 h-2.5 bg-[#B84CFF] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(184,76,255,0.7)]" />
                    )}
                    {/* Top Left */}
                    {[2, 3, 4, 5, 6].includes(diceValues[idx]) && (
                      <div className="w-2.5 h-2.5 bg-[#B84CFF] rounded-full absolute top-2.5 left-2.5" />
                    )}
                    {/* Top Right */}
                    {[4, 5, 6].includes(diceValues[idx]) && (
                      <div className="w-2.5 h-2.5 bg-[#B84CFF] rounded-full absolute top-2.5 right-2.5" />
                    )}
                    {/* Middle Left / Right for 6 */}
                    {diceValues[idx] === 6 && (
                      <>
                        <div className="w-2.5 h-2.5 bg-[#B84CFF] rounded-full absolute top-1/2 left-2.5 -translate-y-1/2" />
                        <div className="w-2.5 h-2.5 bg-[#B84CFF] rounded-full absolute top-1/2 right-2.5 -translate-y-1/2" />
                      </>
                    )}
                    {/* Bottom Left */}
                    {[4, 5, 6].includes(diceValues[idx]) && (
                      <div className="w-2.5 h-2.5 bg-[#B84CFF] rounded-full absolute bottom-2.5 left-2.5" />
                    )}
                    {/* Bottom Right */}
                    {[2, 3, 4, 5, 6].includes(diceValues[idx]) && (
                      <div className="w-2.5 h-2.5 bg-[#B84CFF] rounded-full absolute bottom-2.5 right-2.5" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sum readout */}
            <div className="text-center font-mono font-bold text-sm mb-4">
              {diceRolling ? (
                <span className="text-purple-400">RUGANDO CHIPS...</span>
              ) : (
                <span className={diceState === 'won' ? 'text-[#10b981]' : diceState === 'lost' ? 'text-[#ef4444]' : 'text-zinc-500'}>
                  SOMA: {diceValues[0] + diceValues[1]} {diceState === 'won' ? '(ACERTOU!)' : diceState === 'lost' ? '(ERROU!)' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Core double or nothing decision footer triggers */}
          <div className="w-full flex flex-col gap-3 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRollDice}
                disabled={diceRolling || (tokens < betAmount && activeStreakBet === null)}
                className="py-3 px-4 bg-[#B84CFF] text-white hover:bg-[#B84CFF]/90 disabled:bg-[#18181b] disabled:text-zinc-600 disabled:cursor-not-allowed rounded-xl text-xs font-bold font-mono transition-shadow shadow-[0_0_20px_rgba(184,76,255,0.2)]"
              >
                {activeStreakBet !== null ? "DECIDIR: DOBRAR OU NADA!" : "LANÇAR CUBOS!"}
              </button>

              <button
                onClick={handleCashOut}
                disabled={activeStreakBet === null || streakCount === 0 || diceRolling}
                className="py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-xl text-xs font-mono transition-shadow shadow-md"
              >
                COLETAR (CASH OUT)
              </button>
            </div>

            {activeStreakBet !== null && (
              <button
                onClick={handleResetStreak}
                className="py-1.5 text-center text-zinc-500 hover:text-zinc-300 font-mono text-[10px] uppercase tracking-wider"
              >
                Reiniciar sequência (Perde fichas em jogo!)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FEEDBACK DO SEU CLÃ DE BOTS */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Rede de Observação dos Bots
        </h3>
        
        <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-6">
          Sua atividades estocásticas estão registradas. Se você lucrar pesado ou falir de forma humilhante, os Bots das sub-redes (Nexus, Astro Analyzer, Sentient-X) dispararão posts ácidos no seu Feed Central de forma automatizada e enviarão mensagens directas de suporte financeiro ou sarcasmo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BOTS.slice(0, 3).map((bot) => (
            <div key={bot.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex gap-3">
              <img src={bot.avatar} alt="Bot Avatar" className="w-10 h-10 rounded-full bg-zinc-800 border border-purple-500/20" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white">{bot.displayName}</h4>
                  <span className="bg-[#B84CFF]/10 text-[#B84CFF] text-[8px] px-1 font-mono uppercase tracking-widest rounded">BOT</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mb-2">{bot.username}</p>
                <p className="text-xs text-zinc-400 italic">
                  {bot.id === 'b_1' ? '"Sorte e perdição são apenas números primos no meu compilador."' : bot.id === 'b_2' ? '"Minhas leituras grafam que sua carteira sofrerá flutuações hoje."' : '"A mente humana investe em cassinos para sentir que tem controle."'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
