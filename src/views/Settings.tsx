import { FC, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PaintBucket, Shield, Bell, Network, HardDrive, KeyRound, Check } from 'lucide-react';

const SETTING_SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: PaintBucket },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'network', label: 'Network Protocols', icon: Network },
  { id: 'storage', label: 'Data & Storage', icon: HardDrive },
  { id: 'keys', label: 'Access Keys', icon: KeyRound },
];

export const SettingsView: FC = () => {
  const [activeSection, setActiveSection] = useState('appearance');

  // Simulated Config States
  const [ghostMode, setGhostMode] = useState(() => JSON.parse(localStorage.getItem('alpha_net_ghostMode') || 'false'));
  const [biometricAuth, setBiometricAuth] = useState(() => JSON.parse(localStorage.getItem('alpha_net_biometricAuth') || 'true'));
  const [blurStrength, setBlurStrength] = useState(() => JSON.parse(localStorage.getItem('alpha_net_blurStrength') || '70'));
  const [activeAccent, setActiveAccent] = useState(() => localStorage.getItem('alpha_net_activeAccent') || '#3BA8FF');

  useEffect(() => { localStorage.setItem('alpha_net_ghostMode', JSON.stringify(ghostMode)); }, [ghostMode]);
  useEffect(() => { localStorage.setItem('alpha_net_biometricAuth', JSON.stringify(biometricAuth)); }, [biometricAuth]);
  useEffect(() => { localStorage.setItem('alpha_net_blurStrength', JSON.stringify(blurStrength)); }, [blurStrength]);
  useEffect(() => { localStorage.setItem('alpha_net_activeAccent', activeAccent); }, [activeAccent]);

  const [savingState, setSavingState] = useState<string | null>(null);

  const simulateSave = () => {
    setSavingState('Synching with core node...');
    setTimeout(() => {
      setSavingState('Config updated.');
      setTimeout(() => setSavingState(null), 2000);
    }, 1000);
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
    setter(!current);
    simulateSave();
  };

  return (
    <div className="max-w-5xl mx-auto w-full h-[calc(100vh-140px)] flex gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-64 flex flex-col space-y-1">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4 pl-3">Preferences</h2>
        {SETTING_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive 
                  ? 'bg-white/10 text-white shadow-inner border border-white/5 backdrop-blur-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#3BA8FF]' : 'text-zinc-500'}`} />
              {section.label}
            </button>
          );
        })}

        {savingState && (
          <div className="mt-auto mb-4 pl-3 flex items-center gap-2 text-[10px] font-mono text-[#A5E600] animate-pulse">
             <div className="w-1.5 h-1.5 rounded-full bg-[#A5E600]" />
             {savingState}
          </div>
        )}
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 overflow-y-auto custom-scroll relative overflow-hidden bg-black/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD83D]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
            {SETTING_SECTIONS.find(s => s.id === activeSection)?.label.toUpperCase()} CONFIG
          </h2>

          <div className="space-y-8">
            
            {activeSection === 'appearance' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 border-b border-white/10 pb-2">Theme Engine</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-xl border-2 cursor-pointer relative overflow-hidden text-center group" style={{ borderColor: activeAccent }}>
                      <div className="absolute top-0 right-0 w-24 h-24 blur-xl transition-colors opacity-40 group-hover:opacity-80" style={{ backgroundColor: activeAccent }} />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black mx-auto mb-2 border border-zinc-700 shadow-xl" />
                      <p className="text-sm font-bold text-white relative z-10">Sophisticated Dark</p>
                      <p className="text-[10px] text-zinc-400 font-mono relative z-10" style={{ color: activeAccent }}>Active Layout</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-white/10 cursor-not-allowed opacity-50 text-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-200 to-white mx-auto mb-2 border border-zinc-300" />
                      <p className="text-sm font-bold">Blinding Light</p>
                      <p className="text-[10px] font-mono text-[#FF4A4A]">LOCKED. FATAL ERROR PREVENTED.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 border-b border-white/10 pb-2">Accent Matrix</h3>
                  <div className="flex gap-4">
                    {[
                      { c: '#3BA8FF', n: 'Creator Blue' },
                      { c: '#A5E600', n: 'Community Green' },
                      { c: '#FFD83D', n: 'Develop Yellow' },
                      { c: '#B84CFF', n: 'Bots Purple' },
                      { c: '#FF4A4A', n: 'Lazer Red' }
                    ].map((accent) => (
                      <div key={accent.c} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => { setActiveAccent(accent.c); simulateSave(); }}>
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-transparent hover:border-white transition-all relative flex items-center justify-center"
                          style={{ backgroundColor: accent.c, boxShadow: activeAccent === accent.c ? `0 0 20px ${accent.c}60` : 'none' }}
                        >
                          {activeAccent === accent.c && (
                            <div className="absolute inset-0 border-2 border-white rounded-full scale-110 transition-transform" />
                          )}
                          {activeAccent === accent.c && <Check className="w-4 h-4 text-black" />}
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity absolute mt-12 w-20 text-center pointer-events-none">
                          {accent.n}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 border-b border-white/10 pb-2">UI Density (Simulated)</h3>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                     <div>
                       <p className="font-semibold text-sm">Glassmorphism Blur Layer</p>
                       <p className="text-xs text-zinc-400 font-mono mt-1">Adjust core panel translucency</p>
                     </div>
                     <div className="flex items-center gap-4">
                       <span className="text-xs font-mono w-8 text-right text-zinc-500">{blurStrength}%</span>
                       <input 
                         type="range" min="0" max="100" 
                         value={blurStrength} 
                         onChange={(e) => setBlurStrength(Number(e.target.value))}
                         onMouseUp={simulateSave}
                         className="accent-white w-24" 
                       />
                     </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeSection === 'privacy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div 
                   onClick={() => handleToggle(setGhostMode, ghostMode)}
                   className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start justify-between cursor-pointer hover:bg-white/10 transition-colors"
                 >
                    <div>
                      <h4 className="font-semibold text-sm text-white mb-1">Global Ghost Mode</h4>
                      <p className="text-xs text-zinc-400 font-mono">Hide online status and tracking metrics from all nodes.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ghostMode ? 'bg-[#A5E600]' : 'bg-white/20 border border-white/10'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${ghostMode ? 'left-7' : 'left-1'}`} />
                    </div>
                 </div>
                 
                 <div 
                   onClick={() => handleToggle(setBiometricAuth, biometricAuth)}
                   className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start justify-between cursor-pointer hover:bg-white/10 transition-colors"
                 >
                    <div>
                      <h4 className="font-semibold text-sm text-white mb-1">Biometric Authentication</h4>
                      <p className="text-xs text-zinc-400 font-mono">Require neural-link verification for high-risk protocols.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${biometricAuth ? 'bg-[#3BA8FF]' : 'bg-white/20 border border-white/10'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${biometricAuth ? 'left-7' : 'left-1'}`} />
                    </div>
                 </div>
              </motion.div>
            )}

            {activeSection !== 'appearance' && activeSection !== 'privacy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-zinc-500 font-mono text-sm border border-dashed border-white/10 rounded-3xl bg-white/5">
                Module configuration pending future updates. Core interface locked in preview terminal.
              </motion.div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};
