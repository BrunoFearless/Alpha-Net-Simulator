import { FC } from 'react';
import { motion } from 'motion/react';
import { Heart, UserPlus, MessageCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { MOCK_USERS } from '../data';

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'like',
    user: MOCK_USERS[1],
    content: 'liked your broadcast protocol',
    time: '2m ago',
    read: false,
    icon: Heart,
    color: '#FF4A4A'
  },
  {
    id: 'n2',
    type: 'follow',
    user: MOCK_USERS[2],
    content: 'initiated a follower connection',
    time: '14m ago',
    read: false,
    icon: UserPlus,
    color: '#A5E600'
  },
  {
    id: 'n3',
    type: 'mention',
    user: MOCK_USERS[1],
    content: 'mentioned you in a neural-link update',
    time: '1h ago',
    read: true,
    icon: MessageCircle,
    color: '#3BA8FF'
  },
  {
    id: 'n4',
    type: 'system',
    user: MOCK_USERS[0], // System or admin simulation
    content: 'System sync completed. Node latency stable at 12ms',
    time: '3h ago',
    read: true,
    icon: ShieldAlert,
    color: '#FFD83D'
  },
  {
    id: 'n5',
    type: 'community',
    user: null,
    content: 'New event scheduled in Neural Net Devs community',
    time: '1d ago',
    read: true,
    icon: AlertCircle,
    color: '#B84CFF'
  }
];

export const NotificationsView: FC = () => {
  return (
    <div className="max-w-3xl mx-auto w-full pb-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-2">NOTIFICATIONS</h2>
          <p className="text-zinc-400 font-mono text-sm">System events and entity interactions.</p>
        </div>
        <button className="text-xs font-mono uppercase text-zinc-500 hover:text-white transition-colors">
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif, i) => {
          const Icon = notif.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
              className={`glass-panel p-4 rounded-2xl flex items-start gap-4 transition-colors hover:bg-white/10 ${!notif.read ? 'border-l-2' : ''}`}
              style={{ borderLeftColor: !notif.read ? notif.color : 'transparent' }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
                style={{ backgroundColor: `${notif.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: notif.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  {notif.user ? (
                    <span className="font-semibold text-white mr-1">{notif.user.displayName}</span>
                  ) : null}
                  <span className="text-zinc-300">{notif.content}</span>
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-1">{notif.time}</p>
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: notif.color }} />
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <button className="px-6 py-2 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
           Load Archive
        </button>
      </div>
    </div>
  );
};
