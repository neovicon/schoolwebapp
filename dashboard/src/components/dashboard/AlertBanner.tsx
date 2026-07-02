import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface AlertBannerProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  message: string;
  description?: string;
  isDismissible?: boolean;
  onDismiss?: () => void;
}

export function AlertBanner({ 
  type = 'info', 
  message, 
  description, 
  isDismissible = true,
  onDismiss 
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const styles = {
    success: 'bg-green-500/10 border-green-550/20 text-green-800 dark:text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-550/20 text-yellow-800 dark:text-yellow-400',
    error: 'bg-red-500/10 border-red-550/20 text-red-800 dark:text-red-400',
    info: 'bg-primary-500/10 border-primary-550/20 text-primary-800 dark:text-primary-400',
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`flex items-start gap-4 p-4 rounded-xl border ${styles[type]} select-none shadow-sm`}
        >
          {getIcon()}
          
          <div className="flex-1 flex flex-col text-left">
            <span className="text-sm font-bold leading-tight">{message}</span>
            {description && (
              <span className="text-xs mt-1.5 opacity-80 leading-relaxed font-semibold">
                {description}
              </span>
            )}
          </div>

          {isDismissible && (
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-slate-900/10 dark:hover:bg-white/10 transition-colors shrink-0 text-current cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
