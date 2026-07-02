import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLE_DEFAULT_ROUTES } from '../permissions/roles';

export function UnauthorizedPage() {
  const { user } = useAuth();
  const home = user ? ROLE_DEFAULT_ROUTES[user.role] : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="absolute inset-0 mesh-bg dark:mesh-bg-dark opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center text-center gap-6 max-w-md"
      >
        <div className="w-24 h-24 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center">
          <ShieldOff className="w-12 h-12 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            You don't have permission to view this page. This area is restricted to authorized roles only.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/30">
          403 Unauthorized
        </span>

        <Link
          to={home}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
