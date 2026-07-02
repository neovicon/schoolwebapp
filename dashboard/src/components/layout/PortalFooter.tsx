export function PortalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 md:px-8 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 select-none flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Copyright */}
      <span className="font-medium text-center sm:text-left">
        &copy; {currentYear} Academy Portal. All rights reserved.
      </span>

      {/* Links & Server Status */}
      <div className="flex items-center gap-6">
        <a href="#privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-semibold">
          Privacy Policy
        </a>
        <a href="#support" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-semibold">
          Support Center
        </a>
        
        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 font-bold tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Systems Operational
        </div>
      </div>
    </footer>
  );
}
