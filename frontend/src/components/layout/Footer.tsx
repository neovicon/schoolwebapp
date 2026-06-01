import { Link } from 'react-router-dom';
import { useSchoolSettings } from '../../hooks/useSchoolSettings';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { data: settings } = useSchoolSettings();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img className="h-10 w-auto brightness-0 invert" src={settings.logoUrl} alt={settings.name} />
              ) : (
                <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {settings?.name.charAt(0) || 'S'}
                </div>
              )}
              <span className="font-heading font-bold text-xl text-white">
                {settings?.name || 'School CMS'}
              </span>
            </Link>
            <p className="text-sm leading-6">
              Empowering students to achieve global excellence through innovative education, character building, and community engagement.
            </p>
            <div className="flex space-x-4">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  FB
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  TW
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  IG
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  IN
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider mb-6">Quick Links</h3>
            <ul role="list" className="space-y-4">
              <li><Link to="/about" className="text-sm leading-6 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="text-sm leading-6 hover:text-white transition-colors">Academics</Link></li>
              <li><Link to="/admissions" className="text-sm leading-6 hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/teachers" className="text-sm leading-6 hover:text-white transition-colors">Our Teachers</Link></li>
              <li><Link to="/events" className="text-sm leading-6 hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider mb-6">Support</h3>
            <ul role="list" className="space-y-4">
              <li><Link to="/faq" className="text-sm leading-6 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/downloads" className="text-sm leading-6 hover:text-white transition-colors">Downloads</Link></li>
              <li><Link to="/notices" className="text-sm leading-6 hover:text-white transition-colors">Notice Board</Link></li>
              <li><Link to="/contact" className="text-sm leading-6 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider mb-6">Contact Us</h3>
            <ul role="list" className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0" />
                <span className="text-sm leading-6">{settings?.address || '123 Education Blvd, City, Country'}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                <span className="text-sm leading-6">{settings?.contactPhone || '+1 234 567 890'}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                <span className="text-sm leading-6">{settings?.contactEmail || 'info@school.com'}</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 border-t border-slate-800 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-slate-400">
            &copy; {currentYear} {settings?.name || 'School CMS'}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
