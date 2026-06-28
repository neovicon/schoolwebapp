import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import { useLocation } from 'react-router-dom';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-grow pt-[72px]"> {/* Adjust padding for fixed header */}
        {location.pathname !== '/' && <Breadcrumbs />}
        <Suspense fallback={<div className="p-8 text-center min-h-[60vh] flex items-center justify-center">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
