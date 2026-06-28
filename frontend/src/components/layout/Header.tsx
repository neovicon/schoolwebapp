import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSchoolSettings } from '../../hooks/useSchoolSettings';
import { Menu, X, ChevronDown, GraduationCap, Calendar, FileText, Info, Phone, Users, Image as ImageIcon, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ImageWithFallback from '../ui/ImageWithFallback';

const navigation = [
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Our School', href: '/about', icon: Info, description: 'Learn about our history and values.' },
      { name: 'Teachers', href: '/teachers', icon: Users, description: 'Meet our dedicated faculty.' },
      { name: 'FAQ', href: '/faq', icon: FileText, description: 'Answers to common questions.' },
    ],
  },
  {
    name: 'Academics',
    href: '/academics',
    children: [
      { name: 'Programs', href: '/academics', icon: GraduationCap, description: 'Explore our curriculum.' },
      { name: 'Downloads', href: '/downloads', icon: FileText, description: 'Forms and resources.' },
    ],
  },
  { name: 'Admissions', href: '/admissions' },
  {
    name: 'Campus Life',
    href: '#',
    children: [
      { name: 'Events', href: '/events', icon: Calendar, description: 'Upcoming school activities.' },
      { name: 'News', href: '/news', icon: FileText, description: 'Latest announcements.' },
      { name: 'Gallery', href: '/gallery', icon: ImageIcon, description: 'Photos from campus.' },
      { name: 'Notices', href: '/notices', icon: FileText, description: 'Important alerts.' },
    ],
  },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { data: settings } = useSchoolSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    return localStorage.getItem('hideAnnouncement') !== 'true';
  });
  const location = useLocation();

  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 50], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.85)']);
  const headerBgDark = useTransform(scrollY, [0, 50], ['rgba(15, 23, 42, 0)', 'rgba(2, 6, 23, 0.85)']);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (name: string) => setActiveDropdown(name);
  const handleMouseLeave = () => setActiveDropdown(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const dismissAnnouncement = () => {
    setShowAnnouncement(false);
    localStorage.setItem('hideAnnouncement', 'true');
  };

  return (
    <>
      <motion.header 
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 flex flex-col ${
          scrolled 
            ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10 text-white shadow-sm' 
            : 'bg-slate-950 border-b border-transparent text-white'
        }`}
      >
        <AnimatePresence>
          {showAnnouncement && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="hidden sm:flex bg-gradient-to-r from-primary-600 to-primary-800 text-white px-4 py-2 text-xs font-medium justify-between items-center z-50 overflow-hidden"
            >
              <div className="container-custom flex items-center justify-between py-1">
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex items-center gap-2 group">
                    <Phone className="w-3.5 h-3.5 text-primary-200 group-hover:text-white transition-colors" />
                    <span className="group-hover:text-white transition-colors">{settings?.contactPhone || '+1 234 567 890'}</span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <Mail className="w-3.5 h-3.5 text-primary-200 group-hover:text-white transition-colors" />
                    <span className="group-hover:text-white transition-colors">{settings?.contactEmail || 'info@school.com'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 text-primary-200">
                    <a href={settings?.socialLinks?.facebook || '#'}><FaFacebook className="w-3.5 h-3.5 hover:text-white transition-colors" /></a>
                    <a href={settings?.socialLinks?.twitter || '#'}><FaXTwitter className="w-3.5 h-3.5 hover:text-white transition-colors" /></a>
                    <a href={settings?.socialLinks?.instagram || '#'}><FaInstagram className="w-3.5 h-3.5 hover:text-white transition-colors" /></a>
                  </div>
                  <button onClick={dismissAnnouncement} className="ml-2 p-1 hover:bg-white/20 rounded transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="container-custom flex items-center justify-between py-4" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" onClick={handleLogoClick} className="-m-1.5 p-1.5 flex items-center gap-3 group">
              {settings?.logoUrl ? (
                <ImageWithFallback className="h-9 w-auto group-hover:scale-105 transition-transform duration-300" src={settings.logoUrl} alt={settings?.name || 'School Logo'} />
              ) : (
                <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {(settings?.name || 'G').charAt(0)}
                </div>
              )}
              <span className={`font-heading font-extrabold text-xl tracking-tight transition-colors text-white`}>
                {settings?.name || 'Global Excellence'}
              </span>
            </Link>
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 transition-colors text-slate-300 hover:bg-slate-800`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-1 items-center bg-slate-900/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-sm">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.children && item.children.some(c => location.pathname === c.href));
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.children ? '#' : item.href}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition-all px-4 py-2 rounded-full relative group`}
                  >
                    <span className={`relative z-10 ${isActive ? 'text-primary-300' : 'text-slate-300 group-hover:text-primary-400'}`}>
                      {item.name}
                    </span>
                    {item.children && <ChevronDown className={`h-3.5 w-3.5 relative z-10 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180 text-primary-400' : 'text-slate-400 group-hover:text-primary-400'}`} />}
                    
                    {isActive && (
                      <motion.div 
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-primary-50 dark:bg-primary-900/30 rounded-full"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {item.children && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute left-1/2 z-50 pt-4 w-screen max-w-sm -translate-x-1/2"
                      >
                        <div className="overflow-hidden rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.4)] ring-1 ring-slate-200/50 dark:ring-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3">
                          <div className="grid gap-2">
                            {item.children.map((child) => {
                              const Icon = child.icon;
                              const isChildActive = location.pathname === child.href;
                              return (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`group flex items-start gap-4 rounded-xl p-3 transition-all ${
                                  isChildActive ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg shadow-sm border transition-colors ${
                                  isChildActive ? 'bg-primary-100 border-primary-200 dark:bg-primary-800 dark:border-primary-700' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 group-hover:border-primary-200 dark:group-hover:border-primary-800'
                                }`}>
                                  {Icon && <Icon className={`h-5 w-5 transition-colors ${
                                    isChildActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                  }`} aria-hidden="true" />}
                                </div>
                                <div>
                                  <p className={`text-sm font-semibold mb-0.5 ${
                                    isChildActive ? 'text-primary-900 dark:text-primary-100' : 'text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                  }`}>{child.name}</p>
                                  {child.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{child.description}</p>
                                  )}
                                </div>
                              </Link>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <Link
              to="/admissions"
              className="text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-6 py-2.5 rounded-full transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 border border-primary-400/20"
            >
              Apply Now
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-black/60 backdrop-blur-md lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[100] w-full overflow-y-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-6 py-6 sm:max-w-sm border-l border-slate-200/50 dark:border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                  {settings?.logoUrl ? (
                    <ImageWithFallback className="h-9 w-auto group-hover:scale-105 transition-transform" src={settings.logoUrl} alt={settings?.name || 'School Logo'} />
                  ) : (
                    <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center font-bold">
                      {(settings?.name || 'G').charAt(0)}
                    </div>
                  )}
                  <span className="font-heading font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">{settings?.name || 'Global Excellence'}</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="-my-6 divide-y divide-slate-100 dark:divide-white/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        {item.children ? (
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900 dark:text-white px-3 py-2 flex justify-between items-center text-lg">
                              {item.name}
                            </div>
                            <div className="pl-4 space-y-1 border-l-2 border-primary-100 dark:border-primary-900/30 ml-4">
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className="block rounded-lg px-4 py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="py-6">
                    <Link
                      to="/admissions"
                      className="-mx-3 block rounded-full px-3 py-3 text-base font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 text-center transition-transform active:scale-95 shadow-lg shadow-primary-500/25"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
