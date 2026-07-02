import { motion } from 'framer-motion';
import {
  UserPlus,
  BookOpen,
  CalendarCheck,
  PenLine,
  Users,
  Server,
} from 'lucide-react';
import type { ActivityItem } from '../../../api/dashboard.api';

const TYPE_CONFIG: Record<
  ActivityItem['type'],
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  admission: { icon: UserPlus, color: 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' },
  enrollment: { icon: BookOpen, color: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' },
  attendance: { icon: CalendarCheck, color: 'bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400' },
  assignment: { icon: PenLine, color: 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' },
  user: { icon: Users, color: 'bg-cyan-100 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400' },
  system: { icon: Server, color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
};


function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface AdminActivityFeedProps {
  items: ActivityItem[];
}

export function AdminActivityFeed({ items }: AdminActivityFeedProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm p-6 flex flex-col">
      <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-4">
        Recent Activity
      </h3>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-96 pr-1">
        {items.map((item, i) => {
          const config = TYPE_CONFIG[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3.5 group"
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}
              >
                <config.icon className="w-4.5 h-4.5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] font-semibold text-slate-400 shrink-0 mt-0.5">
                {formatRelativeTime(item.timestamp)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
