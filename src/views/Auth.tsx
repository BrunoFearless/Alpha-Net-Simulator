import React, { FC, useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, ArrowRight, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

export const AuthView: FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'register'>('login');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3BA8FF]/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B84CFF]/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 glass-panel rounded-2xl relative z-10 border border-white/10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3BA8FF] to-[#B84CFF] flex items-center justify-center shadow-[0_0_40px_rgba(59,168,255,0.3)]">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold mb-2 tracking-tight">ALPHA NET <span className="text-[#3BA8FF]">ACCESS</span></h2>
          <p className="text-zinc-400 text-sm font-mono tracking-wide">Enter the grid</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pl-1">Identifier</label>
            <input 
              type="text" 
              placeholder="@username" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3BA8FF]/50 focus:bg-white/10 transition-all text-white placeholder-zinc-600"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pl-1">Pass-key</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3BA8FF]/50 focus:bg-white/10 transition-all text-white placeholder-zinc-600 font-mono"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 mt-4 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <span>{view === 'login' ? 'INITIALIZE SESSION' : 'CREATE PROTOCOL'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
            className="text-xs text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
          >
            {view === 'login' ? 'Request new protocol identity' : 'Already have an identifier?'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
