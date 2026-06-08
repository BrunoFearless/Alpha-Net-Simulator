import { FC } from 'react';
import { motion } from 'motion/react';
import { Heart, UserPlus, MessageCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { useOnline } from '../context/OnlineContext';
import { AppNotification } from '../types';

const getNotificationDetails = (type: AppNotification['type']) => {
  switch (type) {
    case 'like': return { icon: Heart, color: '#FF4A4A' };
    case 'follow': return { icon: UserPlus, color: '#A5E600' };
    case 'comment':
    case 'message': return { icon: MessageCircle, color: '#3BA8FF' };
    case 'system': return { icon: ShieldAlert, color: '#FFD83D' };
    default: return { icon: AlertCircle, color: '#B84CFF' };
  }
};

export const NotificationsView: FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useOnline();

  return (
    <div className="max-w-3xl mx-auto w-full pb-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-2">NOTIFICATIONS</h2>
          <p className="text-zinc-400 font-mono text-sm">System events and entity interactions.</p>
        </div>
        <button 
          onClick={markAllNotificationsAsRead}
          className="text-xs font-mono uppercase text-zinc-500 hover:text-white transition-colors"
        >
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {(notifications || []).map((notif, i) => {
          const { icon: Icon, color } = getNotificationDetails(notif.type);
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
              className={`glass-panel p-4 rounded-2xl flex items-start gap-4 transition-colors hover:bg-white/10 cursor-pointer ${!notif.read ? 'border-l-2' : ''}`}
              style={{ borderLeftColor: !notif.read ? color : 'transparent' }}
              onClick={() => markNotificationAsRead(notif.id)}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  {notif.senderName ? (
                    <span className="font-semibold text-white mr-1">{notif.senderName}</span>
                  ) : null}
                  <span className="text-zinc-300">{notif.content}</span>
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-1">{notif.createdAt instanceof Date ? notif.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: color }} />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {(!notifications || notifications.length === 0) && (
        <div className="text-center py-20 text-zinc-500 font-mono text-sm">
          No new alerts.
        </div>
      )}
    </div>
  );
};
