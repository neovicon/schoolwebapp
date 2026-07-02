import { motion } from 'framer-motion';
import {
  UserPlus,
  BookOpen,
  GraduationCap,
  BarChart3,
  Calendar,
  Settings,
  FileText,
  School,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}


const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'add-student',
    label: 'Add Student',
    description: 'Enroll a new student',
    icon: GraduationCap,
    color: 'from-blue-500/10 to-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-900/30',
  },
  {
    id: 'add-teacher',
    label: 'Add Teacher',
    description: 'Register staff member',
    icon: UserPlus,
    color: 'from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30',
  },
  {
    id: 'new-course',
    label: 'New Course',
    description: 'Create a course',
    icon: BookOpen,
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
  },
  {
    id: 'schedule-class',
    label: 'Schedule Class',
    description: 'Set up timetable',
    icon: Calendar,
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
  },
  {
    id: 'view-reports',
    label: 'View Reports',
    description: 'Academic analytics',
    icon: BarChart3,
    color: 'from-cyan-500/10 to-sky-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30',
  },
  {
    id: 'manage-schools',
    label: 'Schools',
    description: 'Manage institutions',
    icon: School,
    color: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
  },
  {
    id: 'admissions',
    label: 'Admissions',
    description: 'Review applications',
    icon: FileText,
    color: 'from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'System configuration',
    icon: Settings,
    color: 'from-slate-500/10 to-slate-400/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/30',
  },
];

export function AdminQuickActions() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm p-6">
      <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            id={`quick-action-${action.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border bg-gradient-to-br ${action.color} transition-all duration-200 cursor-pointer text-center`}
          >
            <action.icon className="w-6 h-6" />
            <div>
              <p className="text-xs font-bold leading-none">{action.label}</p>
              <p className="text-[10px] font-medium opacity-70 mt-0.5">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
