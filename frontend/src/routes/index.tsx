import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
// import MainLayout from '../layouts/MainLayout';
import MainLayout from '../layouts/MainLayout';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Academics = lazy(() => import('../pages/Academics'));
const Admissions = lazy(() => import('../pages/Admissions'));
const Teachers = lazy(() => import('../pages/Teachers'));
const Gallery = lazy(() => import('../pages/Gallery'));
const Events = lazy(() => import('../pages/Events'));
const News = lazy(() => import('../pages/News'));
const Downloads = lazy(() => import('../pages/Downloads'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Notices = lazy(() => import('../pages/Notices'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'academics', element: <Academics /> },
      { path: 'admissions', element: <Admissions /> },
      { path: 'teachers', element: <Teachers /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'events', element: <Events /> },
      { path: 'news', element: <News /> },
      { path: 'downloads', element: <Downloads /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'notices', element: <Notices /> },
    ],
  },
]);
