import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Global Excellence Academy</title>
      </Helmet>
      
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-primary-50 p-6 rounded-full mb-6">
          <AlertCircle className="w-16 h-16 text-primary-600" />
        </div>
        <h1 className="text-6xl font-bold font-heading text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">Page Not Found</h2>
        <p className="text-slate-500 max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors focus:ring-4 focus:ring-primary-200"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </>
  );
}
