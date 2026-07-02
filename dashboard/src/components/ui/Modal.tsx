import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-slate-900 border dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]`}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-xl font-semibold font-heading text-slate-900 dark:text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full transition-colors bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="overflow-y-auto p-6 text-slate-700 dark:text-slate-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
