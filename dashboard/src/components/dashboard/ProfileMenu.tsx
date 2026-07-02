import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, Sun, Moon, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../permissions/roles';

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync theme from localStorage on mount
  useEffect(() => {
    const saved =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(saved as 'light' | 'dark');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  // Derive display values from AuthContext user
  const displayName = user?.name ?? 'Guest';
  const displayEmail = user?.email ?? '';
  const displayRole = user ? ROLE_LABELS[user.role] : '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        id="profile-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left mr-2">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">
            {displayName}
          </span>
          <span className="text-xs font-semibold text-slate-400 mt-1 leading-none">
            {displayRole}
          </span>
        </div>
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xl dark:shadow-[0_20px_40px_rgb(0,0,0,0.4)] py-2 z-55 overflow-hidden"
          >
            {/* Header info */}
            <div className="px-5 py-4 border-b border-slate-150 dark:border-white/5 flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {displayName}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {displayEmail}
              </span>
              <div className="flex items-center gap-1.5 mt-3 self-start px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950/30 text-[10px] font-bold text-primary-750 dark:text-primary-400 uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                {displayRole} Account
              </div>
            </div>

            {/* Actions */}
            <div className="px-2 py-2 border-b border-slate-150 dark:border-white/5 space-y-0.5">
              <button
                onClick={() => setIsOpen(false)}
                id="profile-menu-my-profile"
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                My Profile
              </button>
              <button
                onClick={() => setIsOpen(false)}
                id="profile-menu-settings"
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Account Settings
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                id="profile-menu-theme-toggle"
                className="flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                    theme === 'dark' ? 'bg-primary-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ${
                      theme === 'dark' ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Logout */}
            <div className="px-2 py-1.5">
              <button
                onClick={handleLogout}
                id="profile-menu-logout"
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
