import { Link } from 'react-router-dom';
import { useSchoolSettings } from '../../hooks/useSchoolSettings';
import ImageWithFallback from '../ui/ImageWithFallback';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ArrowUp, ArrowRight } from 'lucide-react';
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const { data: settings } = useSchoolSettings();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState('');

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#020617] text-slate-300 relative border-t border-white/5 overflow-hidden pt-32">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 filter blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-secondary-600/5 filter blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container-custom relative z-10 pb-12">
        
        {/* Massive Brand Heading */}
        <div className="mb-20 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl">
            <Link to="/" className="inline-flex items-center gap-4 group mb-6">
              {settings?.logoUrl ? (
                <ImageWithFallback className="h-14 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" src={settings.logoUrl} alt={settings.name || 'School Logo'} />
              ) : settings?.name ? (
                <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {settings.name.charAt(0)}
                </div>
              ) : null}
              {settings?.name && (
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {settings.name}
                </h2>
              )}
            </Link>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Empowering the next generation to achieve global excellence through innovative education, character building, and community engagement.
            </p>
          </div>
          
          <div className="flex space-x-4">
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(14,165,233,0.2)]">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="w-5 h-5" />
              </a>
            )}
            {settings?.socialLinks?.twitter && (
              <a href={settings.socialLinks.twitter} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(14,165,233,0.2)]">
                <span className="sr-only">Twitter</span>
                <FaXTwitter className="w-5 h-5" />
              </a>
            )}
            {settings?.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(14,165,233,0.2)]">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="w-5 h-5" />
              </a>
            )}
            {settings?.socialLinks?.linkedin && (
              <a href={settings.socialLinks.linkedin} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(14,165,233,0.2)]">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-t border-white/5 pt-16">
          
          {/* Newsletter (Takes up 4 columns) */}
          <div className="lg:col-span-4 lg:pr-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-400"></span>
              Stay Updated
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Join our newsletter to receive the latest updates, event announcements, and educational insights directly in your inbox.</p>
            <form onSubmit={handleSubscribe} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:bg-white/10 focus-within:border-primary-500/50 transition-all backdrop-blur-sm shadow-inner overflow-hidden">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="mr-2 aspect-square p-2.5 flex items-center justify-center text-white bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-600/30"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-400"></span>
              Explore
            </h3>
            <ul role="list" className="space-y-4">
              {['About Us', 'Academics', 'Admissions', 'Our Teachers', 'Events'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary-400 group-hover:w-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-400"></span>
              Support
            </h3>
            <ul role="list" className="space-y-4">
              {['FAQ', 'Downloads', 'Notice Board', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Notice Board' ? '/notices' : `/${item.toLowerCase().replace(' ', '')}`} className="text-sm text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary-400 group-hover:w-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info (Takes up 3 columns) */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-400"></span>
              Get in Touch
            </h3>
            <ul role="list" className="space-y-5">
              {settings?.address && (
                <li className="flex gap-4 items-start group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-primary-600 group-hover:text-white border border-white/10 group-hover:border-primary-500 transition-all shrink-0 text-primary-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-400 leading-relaxed pt-2 group-hover:text-slate-300 transition-colors">{settings.address}</span>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex gap-4 items-center group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-primary-600 group-hover:text-white border border-white/10 group-hover:border-primary-500 transition-all shrink-0 text-primary-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{settings.contactPhone}</span>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex gap-4 items-center group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-primary-600 group-hover:text-white border border-white/10 group-hover:border-primary-500 transition-all shrink-0 text-primary-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{settings.contactEmail}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} {settings?.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-[0_8px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.4)] transition-all z-50 group border border-primary-400/20"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
