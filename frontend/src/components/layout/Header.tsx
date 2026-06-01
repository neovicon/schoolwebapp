import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSchoolSettings } from '../../hooks/useSchoolSettings';
import { Menu, X, ChevronDown, GraduationCap, Calendar, FileText, Info, Phone, Users, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Our School', href: '/about', icon: Info },
      { name: 'Teachers', href: '/teachers', icon: Users },
      { name: 'FAQ', href: '/faq', icon: FileText },
    ],
  },
  {
    name: 'Academics',
    href: '/academics',
    children: [
      { name: 'Programs', href: '/academics', icon: GraduationCap },
      { name: 'Downloads', href: '/downloads', icon: FileText },
    ],
  },
  { name: 'Admissions', href: '/admissions' },
  {
    name: 'Campus Life',
    href: '#',
    children: [
      { name: 'Events', href: '/events', icon: Calendar },
      { name: 'News', href: '/news', icon: FileText },
      { name: 'Gallery', href: '/gallery', icon: Image },
      { name: 'Notices', href: '/notices', icon: FileText },
    ],
  },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { data: settings } = useSchoolSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const handleMouseEnter = (name: string) => setActiveDropdown(name);
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <nav className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            {settings?.logoUrl ? (
              <img className="h-10 w-auto" src={settings.logoUrl} alt={settings.name} />
            ) : (
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {settings?.name.charAt(0) || 'S'}
              </div>
            )}
            <span className="font-heading font-bold text-xl text-slate-900 hidden sm:block">
              {settings?.name || 'School CMS'}
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => item.children && handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.children ? '#' : item.href}
                className={`flex items-center gap-1 text-sm font-semibold leading-6 transition-colors px-2 py-1 rounded-md ${
                  location.pathname === item.href || (item.children && activeDropdown === item.name)
                    ? 'text-primary-600'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {item.name}
                {item.children && <ChevronDown className="h-4 w-4" />}
              </Link>

              {item.children && activeDropdown === item.name && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 z-10 pt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0"
                >
                  <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="group flex items-center gap-4 rounded-lg p-3 hover:bg-slate-50 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 group-hover:bg-primary-100">
                            {child.icon && <child.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{child.name}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <Link
            to="/admissions"
            className="text-sm font-semibold leading-6 text-white bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-full transition-colors shadow-sm"
          >
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10"
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3">
                   <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {settings?.name.charAt(0) || 'S'}
                  </div>
                  <span className="font-heading font-bold text-lg">{settings?.name || 'School'}</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-slate-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        {item.children ? (
                          <div className="space-y-1">
                            <div className="font-medium text-slate-900 px-3 py-2">{item.name}</div>
                            <div className="pl-6 space-y-1 border-l-2 border-slate-100 ml-4">
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600"
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
                            className="-mx-3 block rounded-lg px-3 py-2 font-medium text-slate-900 hover:bg-slate-50 hover:text-primary-600"
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
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-primary-600 text-center"
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
    </header>
  );
}
