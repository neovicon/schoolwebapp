import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { PortalHeader } from './PortalHeader';
import { PortalFooter } from './PortalFooter';
import { Breadcrumbs } from '../navigation/Breadcrumbs';

export function PortalLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <PortalHeader />

        {/* Breadcrumb trail */}
        <Breadcrumbs />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <PortalFooter />
      </div>
    </div>
  );
}
