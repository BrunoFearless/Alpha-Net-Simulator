import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Palette, Code2, Cpu, Zap, ArrowRight, X, Terminal, LucideIcon } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Module } from '../types';
import { useOnline } from '../context/OnlineContext';
import { CommunityRadar } from '../components/modules/CommunityRadar';
import { CreatorCanvas } from '../components/modules/CreatorCanvas';
import { DevelopScanner } from '../components/modules/DevelopScanner';
import { BotsMonitor } from '../components/modules/BotsMonitor';
import { LazerGame } from '../components/modules/LazerGame';

const DEFAULT_MODULES: Module[] = [
  { id: 'community', title: 'COMMUNITY', color: '#A5E600', iconName: 'Users', desc: 'Decentralized social hubs and event spaces.' },
  { id: 'creator', title: 'CREATOR', color: '#3BA8FF', iconName: 'Palette', desc: 'Portfolio, media drops, and interaction analytics.' },
  { id: 'develop', title: 'DEVELOP', color: '#FFD83D', iconName: 'Code2', desc: 'Git trees, logic snippets, and roadmaps.' },
  { id: 'bots', title: 'BOTS', color: '#B84CFF', iconName: 'Cpu', desc: 'AI assistant marketplace and generation wizards.' },
  { id: 'lazer', title: 'LAZER', color: '#FF4A4A', iconName: 'Zap', desc: 'High-speed entertainment and challenges.' }
];

const ICON_MAP: Record<string, LucideIcon> = { Users, Palette, Code2, Cpu, Zap };

export const ModuleHub: FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const { isOnline } = useOnline();
  const [modules, setModules] = useState<Module[]>(DEFAULT_MODULES);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(false);

  useEffect(() => {
    if (isOnline) {
      const fetchModules = async () => {
        const querySnapshot = await getDocs(collection(db, 'modules'));
        if (!querySnapshot.empty) {
          setModules(querySnapshot.docs.map(doc => doc.data() as Module));
        }
      };
      fetchModules();
    } else {
      setModules(DEFAULT_MODULES);
    }
  }, [isOnline]);

  const selectedModule = modules.find(m => m.id === activeModuleId);
  const Icon = selectedModule ? ICON_MAP[selectedModule.iconName] || Cpu : Cpu;

  const handleInit = () => {
    setIsBooting(true);
    setLogs([]);
    const sequence = [
      "Initializing quantum kernel routing...",
      "Bypassing node security handshakes...",
      `Loading ${selectedModule?.title || 'Unknown'} core directives...`,
      "Synchronizing with decentralized ledger...",
      isOnline ? "Connection confirmed." : "[ERR] Invalid access token.",
      isOnline ? "Module online and operational." : "Simulation boundary enforced. Module requires Level 4 clearance."
    ];

    sequence.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === sequence.length - 1) {
          setIsBooting(false);
        }
      }, index * 400);
    });
  };

  const handleClose = () => {
    setActiveModuleId(null);
    setLogs([]);
    setIsBooting(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] relative flex flex-col items-center justify-center p-2 sm:p-4">
      
      <AnimatePresence mode="wait">
        {!activeModuleId ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full py-6"
          >
            {modules.map((mod, i) => {
              const DynamicIcon = ICON_MAP[mod.iconName] || Cpu;
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                  onClick={() => setActiveModuleId(mod.id)}
                  className="bg-white/5 p-5 sm:p-6 rounded-3xl cursor-pointer group hover:bg-white/10 transition-all border border-white/5 relative overflow-hidden h-44 sm:h-48 flex flex-col justify-between"
                  style={{
                    boxShadow: `0 0 0 0 ${mod.color}00`,
                  }}
                  whileHover={{
                    boxShadow: `0 0 30px -10px ${mod.color}50`,
                    borderColor: `${mod.color}50`
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-60 transition-opacity pointer-events-none" style={{ backgroundColor: mod.color }} />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="p-2 sm:p-3 rounded-2xl bg-black/40 border border-white/10 ring-1 ring-white/5 shadow-inner">
                      <DynamicIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: mod.color }} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-display font-bold tracking-widest text-[#FFF] text-md sm:text-lg mb-1">{mod.title}</h3>
                    <p className="text-zinc-400 text-[10.5px] sm:text-xs font-mono">{mod.desc}</p>
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
            className="w-full max-w-5xl mx-auto flex flex-col gap-6"
          >
            <div className="flex justify-start">
              <button 
                onClick={handleClose}
                className="p-2 px-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-50 flex items-center gap-2 border border-white/10"
              >
                <X className="w-4 h-4" />
                <span className="text-xs font-mono font-semibold uppercase">Close Engine</span>
              </button>
            </div>

            <div className="w-full bg-white/5 rounded-3xl overflow-hidden relative border border-white/10 flex flex-col items-center justify-center text-center p-4 sm:p-8 md:p-12 min-h-[380px]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] blur-[100px] sm:blur-[150px] opacity-25 pointer-events-none" style={{ backgroundColor: selectedModule?.color, animation: 'blob 10s infinite' }} />
              
              <div className="relative z-10 w-full max-w-xl">
                <Icon className={`w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 opacity-80 ${isBooting ? 'animate-pulse' : ''}`} style={{ color: selectedModule?.color }} />
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tighter mb-4 text-white">{selectedModule?.title} SYS</h2>
                
                {logs.length === 0 && !isBooting && (
                  <>
                    <p className="text-sm sm:text-base md:text-xl text-zinc-300 font-mono tracking-wide max-w-sm sm:max-w-xl mx-auto opacity-70 px-2">
                      Simulation environment active. Connect to terminal to boot protocols.
                    </p>
                    <button 
                      onClick={handleInit}
                      className="mt-6 sm:mt-10 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-black text-xs sm:text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: selectedModule?.color }}
                    >
                      Initialize Interface
                    </button>
                  </>
                )}

                {(logs.length > 0 || isBooting) && (
                  <div className="mt-6 sm:mt-8 bg-black/80 border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-lg min-h-[300px] overflow-hidden flex flex-col relative" style={{ borderColor: `${selectedModule?.color}40` }}>
                    {activeModuleId === 'community' && <CommunityRadar color={selectedModule!.color} />}
                    {activeModuleId === 'creator' && <CreatorCanvas color={selectedModule!.color} />}
                    {activeModuleId === 'develop' && <DevelopScanner color={selectedModule!.color} />}
                    {activeModuleId === 'bots' && <BotsMonitor color={selectedModule!.color} />}
                    {activeModuleId === 'lazer' && <LazerGame color={selectedModule!.color} />}
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
