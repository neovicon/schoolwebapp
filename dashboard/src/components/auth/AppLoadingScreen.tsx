import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AppLoadingScreenProps {
  /** When provided, renders children once session is ready instead of a standalone screen. */
  children?: React.ReactNode;
}

/**
 * Full-screen loading state shown while the auth session is being restored.
 * - Standalone usage (no children): renders the loading screen directly.
 * - Wrapper usage (with children): blocks render of children until `isLoading` is false,
 *   preventing route guards from flashing the login page on page refresh.
 */
export function AppLoadingScreen({ children }: AppLoadingScreenProps) {
  const { isLoading } = useAuth();

  const screen = (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 z-50">
      {/* Ambient background */}
      <div className="absolute inset-0 mesh-bg dark:mesh-bg-dark opacity-60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Logo mark */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30 flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-extrabold font-heading bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            SchoolPortal
          </span>
          <span className="text-sm text-slate-400 font-medium">
            Restoring your session…
          </span>
        </div>

        {/* Animated progress bar */}
        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );

  // Standalone mode: just render the screen
  if (!children) return screen;

  // Wrapper mode: block children until session is restored
  if (isLoading) return screen;

  return <>{children}</>;
}
