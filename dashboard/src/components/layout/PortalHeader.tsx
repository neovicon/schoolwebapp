import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Command } from 'lucide-react';
import { ProfileMenu } from '../dashboard/ProfileMenu';
import { NotificationPanel } from '../dashboard/NotificationPanel';
import { GlobalSearchModal } from '../navigation/GlobalSearchModal';

export function PortalHeader() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Listen for global shortcut events (triggered by GlobalSearchModal on K down)
  useEffect(() => {
    const handleToggle = () => setIsSearchOpen((prev) => !prev);
    window.addEventListener('global-search:toggle', handleToggle);
    return () => window.removeEventListener('global-search:toggle', handleToggle);
  }, []);

  // Deriving title from pathname
  const getPageTitle = () => {
    const paths = location.pathname.split('/').filter(x => x);
    if (paths.length === 0) return 'Dashboard';
    const lastPath = paths[paths.length - 1];
    return lastPath
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <header className="sticky top-0 z-20 w-full h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 md:px-8 select-none">
        
        {/* Left: Page Title */}
        <div className="flex flex-col text-left">
          <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white leading-none">
            {getPageTitle()}
          </h1>
          <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-1">
            Welcome back to the portal
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all duration-200 cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search...</span>
            <div className="flex items-center gap-0.5 ml-3 px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-md text-3xs text-slate-400 dark:text-slate-500">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>

          {/* Mobile Search Trigger Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex sm:hidden p-2.5 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <Search className="w-5.5 h-5.5" />
          </button>

          {/* Notification Trigger Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <Bell className="w-5.5 h-5.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-8 bg-slate-200 dark:bg-white/5" />

          {/* Profile Dropdown */}
          <ProfileMenu />

        </div>
      </header>

      {/* Slide-over Notification Panel */}
      <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Command-K Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
