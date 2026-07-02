import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLE_DEFAULT_ROUTES } from '../permissions/roles';

export function NotFoundPage() {
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
        <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center">
          <Compass className="w-12 h-12 text-slate-400" />
        </div>

        <div className="space-y-2">
          <p className="text-8xl font-extrabold font-heading bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            404
          </p>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

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
