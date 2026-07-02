import { useLocation, useNavigate } from 'react-router-dom';
import { FolderLock } from 'lucide-react';
import { EmptyState } from '../components/dashboard/EmptyState';

export function PlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageName = () => {
    const paths = location.pathname.split('/').filter(x => x);
    if (paths.length === 0) return 'Page';
    const lastPath = paths[paths.length - 1];
    return lastPath
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[60vh] py-12">
      <EmptyState
        title={`${getPageName()} Feature Out of Scope`}
        description={`The "${getPageName()}" module is currently out of scope for this bootstrap phase. It will be built in the next development phase.`}
        icon={<FolderLock className="w-8 h-8 text-primary-500" />}
        actionText="Back to Dashboard"
        onAction={() => navigate('/')}
        className="w-full shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-white/5"
      />
    </div>
  );
}
