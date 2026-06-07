import { FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { MapPin, Link2, Award, X, MessageSquare, Users } from 'lucide-react';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
}

export const UserProfileModal: FC<UserProfileModalProps> = ({ user, onClose }) => {
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#050505] border border-white/10 rounded-3xl z-[101] overflow-hidden shadow-2xl"
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
                   <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl bg-zinc-950 border-4 border-[#050505] relative z-10" />
                   <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#A5E600] border-2 border-[#050505] rounded-full z-20" />
                 </div>
                 
                 <div className="flex gap-2 pb-1">
                   {user.badges.includes('AI') && (
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
                     {user.followers.toLocaleString()} Followers
                   </div>
                   {!user.badges.includes('AI') && (
                     <div className="flex items-center gap-1.5 text-zinc-400">
                       <MapPin className="w-3.5 h-3.5 text-zinc-500" /> Cyberia
                     </div>
                   )}
                 </div>

                 <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/5">
                   {user.badges.map((badge, i) => (
                     <div key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-zinc-300 shadow-inner">
                       <Award className="w-3 h-3 text-[#FFD83D]" />
                       {badge}
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
