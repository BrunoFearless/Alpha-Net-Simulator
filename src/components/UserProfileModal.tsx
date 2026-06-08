import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { MapPin, Award, X, Users, Gift as GiftIcon, Coins, CheckCircle, AlertTriangle } from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';
import { useOnline } from '../context/OnlineContext';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
}

const PRESET_GIFTS = [
  { type: 'Sinal Quântico', amount: 10, icon: '📡', desc: 'Dá um bônus de latência' },
  { type: 'Placa de Rede', amount: 100, icon: '💾', desc: 'Aumenta banda de transmissão' },
  { type: 'Reator de Vazio', amount: 500, icon: '🔋', desc: 'Energia quântica ilimitada' },
];

export const UserProfileModal: FC<UserProfileModalProps> = ({ user, onClose }) => {
  const { currentUser, sendGift, tokenBalance, isOnline } = useOnline();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [sendingState, setSendingState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [giftSentMsg, setGiftSentMsg] = useState('');

  const isSelf = user ? user.id === currentUser.id : false;

  const handleSendGiftDef = async (type: string, amount: number) => {
    if (!user) return;
    if (tokenBalance < amount) {
      setErrorMessage('Saldo de fichas insuficiente para este presente.');
      setSendingState('error');
      setTimeout(() => setSendingState('idle'), 3000);
      return;
    }

    setSendingState('sending');
    try {
      const ok = await sendGift(user.id, user.displayName, amount, type);
      if (ok) {
        setGiftSentMsg(`Você presenteou ${user.displayName} com um(a) "${type}" (${amount} tokens)`);
        setSendingState('success');
        setTimeout(() => setSendingState('idle'), 4000);
      } else {
        setErrorMessage('Falha na transferência do presente.');
        setSendingState('error');
        setTimeout(() => setSendingState('idle'), 3000);
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Erro inesperado.');
      setSendingState('error');
      setTimeout(() => setSendingState('idle'), 3000);
    }
  };

  const handleCustomSend = () => {
    const amt = parseInt(customAmount, 10);
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage('Por favor, informe uma quantia válida de tokens.');
      setSendingState('error');
      setTimeout(() => setSendingState('idle'), 3000);
      return;
    }
    handleSendGiftDef('Transferência Direta', amt);
  };

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#050505] border border-white/10 rounded-3xl z-[101] overflow-hidden shadow-2xl maxHeight-[90vh] overflow-y-auto custom-scroll"
          >
            <div className="h-24 w-full relative bg-zinc-900 border-b border-white/10 p-4 flex justify-between items-start">
              <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#3BA8FF]/20 rounded-full blur-[60px] pointer-events-none" />
              <div className="w-full h-full absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />
              
              <div />
              <button 
                onClick={onClose}
                className="relative z-10 w-8 h-8 flex items-center justify-center bg-black/40 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 pb-6 relative">
               <div className="flex justify-between items-end -mt-10 mb-4">
                 <div className="relative">
                    <div className="absolute inset-0 bg-[#A5E600] rounded-full blur-xl opacity-20 pointer-events-none" />
                    <AvatarDisplay user={user} className="w-20 h-20 rounded-2xl bg-zinc-950 border-4 border-[#050505] relative z-10" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#A5E600] border-2 border-[#050505] rounded-full z-20" />
                 </div>
                 
                 <div className="flex gap-2 pb-1">
                    {user.badges?.includes('AI') && (
                      <div className="px-3 py-1 bg-[#B84CFF]/20 text-[#B84CFF] text-[10px] uppercase font-bold rounded-full font-mono tracking-widest border border-[#B84CFF]/30">
                        AI BOT
                      </div>
                    )}
                 </div>
               </div>

               <div>
                 <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                    {user.displayName}
                 </h2>
                 <p className="text-zinc-400 font-mono text-xs">{user.username}</p>
                 
                 <p className="mt-3 text-sm text-zinc-200 leading-relaxed">{user.bio}</p>

                 <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Users className="w-3.5 h-3.5 text-zinc-500" /> 
                      {(user.followers ?? 0).toLocaleString()} Seguidores
                    </div>
                    {!user.badges?.includes('AI') && (
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" /> Rede Central
                      </div>
                    )}
                 </div>

                 {/* Badges */}
                 {user.badges && user.badges.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                     {user.badges.map((badge, i) => (
                       <div key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-zinc-300 shadow-inner">
                         <Award className="w-3 h-3 text-[#FFD83D]" />
                         {badge}
                       </div>
                     ))}
                   </div>
                 )}

                 {/* GIFTING CONSOLE */}
                 {!isSelf && (
                   <div className="mt-5 pt-4 border-t border-white/10">
                     <div className="flex items-center gap-2 mb-3">
                       <GiftIcon className="w-4 h-4 text-[#A5E600] animate-bounce" />
                       <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">CONEXÃO E PRESENTES</h3>
                     </div>

                     {sendingState === 'sending' && (
                       <div className="py-6 flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/5">
                         <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#A5E600] animate-spin mb-3" />
                         <p className="text-xs text-zinc-400 font-mono">Transferindo pacotes de dados no grid...</p>
                       </div>
                     )}

                     {sendingState === 'success' && (
                       <div className="py-5 px-4 bg-[#A5E600]/10 border border-[#A5E600]/30 rounded-xl flex items-center gap-3">
                         <CheckCircle className="w-6 h-6 text-[#A5E600]" />
                         <div>
                           <p className="text-xs font-bold text-white">CONEXÃO ESTABELECIDA</p>
                           <p className="text-[11px] text-[#A5E600] font-mono leading-tight">{giftSentMsg}</p>
                         </div>
                       </div>
                     )}

                     {sendingState === 'error' && (
                       <div className="py-5 px-4 bg-[#FF4A4A]/10 border border-[#FF4A4A]/30 rounded-xl flex items-center gap-3">
                         <AlertTriangle className="w-6 h-6 text-[#FF4A4A]" />
                         <div>
                           <p className="text-xs font-bold text-white">REJEIÇÃO DE PROTOCOLO</p>
                           <p className="text-[11px] text-[#FF4A4A] font-mono leading-tight">{errorMessage}</p>
                         </div>
                       </div>
                     )}

                     {sendingState === 'idle' && (
                       <div className="space-y-3">
                         <div className="grid grid-cols-3 gap-2">
                           {PRESET_GIFTS.map((gift) => (
                             <button
                               key={gift.type}
                               onClick={() => handleSendGiftDef(gift.type, gift.amount)}
                               className="bg-white/5 border border-white/10 hover:border-[#A5E600]/40 p-2 rounded-xl flex flex-col items-center hover:bg-white/10 transition-all cursor-pointer text-center group"
                             >
                               <span className="text-lg mb-1 group-hover:scale-125 transition-transform">{gift.icon}</span>
                               <span className="text-[10px] font-bold text-zinc-100 truncate w-full">{gift.type}</span>
                               <span className="text-[9px] font-mono text-[#A5E600] mt-0.5">{gift.amount} Fichas</span>
                             </button>
                           ))}
                         </div>

                         {/* Custom amount gift */}
                         <div className="flex gap-2">
                           <div className="relative flex-1">
                             <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5" />
                             <input
                               type="number"
                               placeholder="Quantia customizada..."
                               value={customAmount}
                               onChange={(e) => setCustomAmount(e.target.value)}
                               className="bg-black/50 border border-white/10 focus:border-[#A5E600]/40 rounded-xl py-2 pl-9 pr-3 text-xs text-white max-w-full w-full focus:outline-none placeholder-zinc-500 font-mono"
                             />
                           </div>
                           <button
                             onClick={handleCustomSend}
                             className="bg-white text-black hover:bg-zinc-200 px-4 rounded-xl text-xs font-semibold shrink-0 transition-colors"
                           >
                             Enviar
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

