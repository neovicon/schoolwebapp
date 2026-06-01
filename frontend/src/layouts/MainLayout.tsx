import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-slate-50">
      <Header />
      <main className="flex-grow pt-[72px]"> {/* Adjust padding for fixed header */}
        <Suspense fallback={<div className="p-8 text-center min-h-[60vh] flex items-center justify-center">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
