import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, AlertTriangle, AlertCircle, Info, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Assignment Posted',
    description: 'Advanced Physics Chapter 4 exercises have been posted by Prof. Jameson.',
    time: '10 minutes ago',
    type: 'info',
    read: false,
  },
  {
    id: '2',
    title: 'Grade Released',
    description: 'Your final score for Midterm Calculus is now available in your reports.',
    time: '2 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: '3',
    title: 'Tuition Fee Reminder',
    description: 'Term 3 tuition fees payment deadline is coming up on July 5th.',
    time: '1 day ago',
    type: 'warning',
    read: true,
  },
  {
    id: '4',
    title: 'Exam Rescheduled',
    description: 'The Chemistry lab exam has been moved from Room 302 to Hall A.',
    time: '3 days ago',
    type: 'danger',
    read: true,
  },
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          {/* Sliding Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/5 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-slate-800 dark:text-white" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h3>
                <Badge variant="primary" className="ml-1">
                  {mockNotifications.filter(n => !n.read).length} New
                </Badge>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
              {mockNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">All caught up!</p>
                  <p className="text-xs text-slate-400 mt-1">You have no new notifications.</p>
                </div>
              ) : (
                mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-6 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors flex gap-4 ${
                      !notif.read ? 'bg-primary-50/10 dark:bg-primary-500/5' : ''
                    }`}
                  >
                    {getIcon(notif.type)}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-sm font-bold leading-tight ${
                          !notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-350'
                        }`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                      <span className="text-xs text-slate-550 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {notif.description}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-3 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        {notif.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-white/5 text-center">
              <button
                onClick={onClose}
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-350 transition-colors py-2 px-4 cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
