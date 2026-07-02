import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeaturePlaceholderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
}

/**
 * Reusable placeholder card for stub pages that aren't implemented yet.
 */
export function FeaturePlaceholder({
  title,
  description,
  icon: Icon = Construction,
  badge = 'Coming Soon',
}: FeaturePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 max-w-md"
      >
        {/* Icon blob */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary-500/10 to-secondary-500/10 border border-primary-100 dark:border-primary-900/30 flex items-center justify-center shadow-inner">
          <Icon className="w-12 h-12 text-primary-500 dark:text-primary-400" />
        </div>

        {/* Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800/30">
          {badge}
        </span>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description ??
              'This module is part of the next development milestone and will be available soon.'}
          </p>
        </div>

        {/* Progress line */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full" />
        </div>
        <span className="text-xs text-slate-400 font-medium -mt-3">Architecture complete — UI in progress</span>
      </motion.div>
    </div>
  );
}
