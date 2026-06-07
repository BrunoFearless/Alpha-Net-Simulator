import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Palette, Code2, Cpu, Zap, ArrowRight, X, Terminal } from 'lucide-react';

const MODULES = [
  { id: 'community', title: 'COMMUNITY', color: '#A5E600', icon: Users, desc: 'Decentralized social hubs and event spaces.' },
  { id: 'creator', title: 'CREATOR', color: '#3BA8FF', icon: Palette, desc: 'Portfolio, media drops, and interaction analytics.' },
  { id: 'develop', title: 'DEVELOP', color: '#FFD83D', icon: Code2, desc: 'Git trees, logic snippets, and roadmaps.' },
  { id: 'bots', title: 'BOTS', color: '#B84CFF', icon: Cpu, desc: 'AI assistant marketplace and generation wizards.' },
  { id: 'lazer', title: 'LAZER', color: '#FF4A4A', icon: Zap, desc: 'High-speed entertainment and challenges.' }
];

export const ModuleHub: FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(false);

  const selectedModule = MODULES.find(m => m.id === activeModule);

  const handleInit = () => {
    setIsBooting(true);
    setLogs([]);
    const sequence = [
      "Initializing quantum kernel routing...",
      "Bypassing node security handshakes...",
      `Loading ${selectedModule?.title} core directives...`,
      "Synchronizing with decentralized ledger...",
      "[ERR] Invalid access token.",
      "Simulation boundary enforced. Module requires Level 4 clearance."
    ];

    sequence.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === sequence.length - 1) {
          setIsBooting(false);
        }
      }, index * 800);
    });
  };

  const handleClose = () => {
    setActiveModule(null);
    setLogs([]);
    setIsBooting(false);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] relative flex items-center justify-center -mt-8">
      
      <AnimatePresence>
        {!activeModule ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full p-6"
          >
            {MODULES.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                  onClick={() => setActiveModule(mod.id)}
                  className={`bg-white/5 p-6 rounded-3xl cursor-pointer group hover:bg-white/10 transition-all border border-white/5 relative overflow-hidden h-48 flex flex-col justify-between ${i === 3 ? 'lg:col-start-1 lg:col-span-1.5' : ''} ${i === 4 ? 'lg:col-start-2 lg:col-span-2' : ''}`}
                  style={{
                    boxShadow: `0 0 0 0 ${mod.color}00`,
                  }}
                  whileHover={{
                    boxShadow: `0 0 30px -10px ${mod.color}50`,
                    borderColor: `${mod.color}50`
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: mod.color }} />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 ring-1 ring-white/5 shadow-inner">
                      <Icon className="w-6 h-6" style={{ color: mod.color }} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-display font-bold tracking-widest text-lg mb-1">{mod.title}</h3>
                    <p className="text-zinc-400 text-xs font-mono">{mod.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 p-8 pt-12 flex flex-col"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 left-8 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-50 flex items-center gap-2 pr-4 border border-white/10"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold uppercase">Close Engine</span>
            </button>

            <div className="flex-1 w-full max-w-5xl mx-auto bg-white/5 rounded-3xl overflow-hidden relative border border-white/10 flex flex-col items-center justify-center text-center p-8 mt-10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] opacity-30 pointer-events-none" style={{ backgroundColor: selectedModule?.color, animation: 'blob 10s infinite' }} />
              
              <div className="relative z-10 w-full max-w-xl">
                <selectedModule.icon className={`w-20 h-20 mx-auto mb-6 opacity-80 ${isBooting ? 'animate-pulse' : ''}`} style={{ color: selectedModule?.color }} />
                <h2 className="font-display text-5xl font-bold tracking-tighter mb-4">{selectedModule?.title} SYS</h2>
                
                {logs.length === 0 && !isBooting && (
                  <>
                    <p className="text-xl text-zinc-300 font-mono tracking-wide max-w-xl mx-auto opacity-70">
                      Simulation environment active. Connect to terminal to boot protocols.
                    </p>
                    <button 
                      onClick={handleInit}
                      className="mt-10 px-8 py-3 rounded-full font-bold text-black text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: selectedModule?.color }}
                    >
                      Initialize Interface
                    </button>
                  </>
                )}

                {(logs.length > 0 || isBooting) && (
                  <div className="mt-8 bg-black/80 border border-white/10 rounded-xl p-6 text-left font-mono text-[11px] h-48 overflow-y-auto flex flex-col relative" style={{ borderColor: `${selectedModule?.color}40` }}>
                    <div className="flex items-center gap-2 mb-4 text-white/50 pb-2 border-b border-white/10">
                      <Terminal className="w-4 h-4" /> 
                      <span className="uppercase tracking-widest">{selectedModule?.title} terminal instance v2.4</span>
                    </div>
                    {logs.map((log, index) => (
                      <div key={index} className={`mb-2 ${log.includes('[ERR]') ? 'text-[#FF4A4A]' : 'text-zinc-300'}`}>
                        <span style={{ color: selectedModule?.color }} className="mr-2">{'>'}</span> 
                        {log}
                      </div>
                    ))}
                    {isBooting && (
                      <div className="animate-pulse flex items-center" style={{ color: selectedModule?.color }}>
                        <span className="mr-2">{'>'}</span> _
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
