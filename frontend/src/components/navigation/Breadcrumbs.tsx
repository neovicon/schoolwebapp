import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex px-4 py-3 text-sm text-slate-500 bg-slate-50/50 border-b border-slate-100" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto w-full flex items-center space-x-2">
        <Link to="/" className="text-slate-400 hover:text-primary-600 transition-colors">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Format text (capitalize and replace hyphens)
          const text = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

          return (
            <div key={to} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-slate-300" />
              {last ? (
                <span className="text-slate-800 font-medium" aria-current="page">
                  {text}
                </span>
              ) : (
                <Link to={to} className="text-slate-500 hover:text-primary-600 transition-colors">
                  {text}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
