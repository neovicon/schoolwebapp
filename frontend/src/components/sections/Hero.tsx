import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImageUrl?: string;
  backgroundImage?: any;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export default function Hero({
  title,
  subtitle,
  backgroundImageUrl,
  backgroundImage,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: HeroProps) {
  let finalImageUrl = backgroundImageUrl;
  if (!finalImageUrl && backgroundImage?.url) {
    let url = backgroundImage.url;
    if (url.startsWith('/')) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';
      const serverUrl = apiBase.replace('/api', '');
      url = `${serverUrl}${url}`;
    }
    finalImageUrl = url;
  }

  return (
    <div className="relative bg-slate-900 overflow-hidden min-h-[80vh] flex items-center">
      {/* Background Image with Overlay */}
      {finalImageUrl && (
        <>
          <div className="absolute inset-0">
            <img
              src={finalImageUrl}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            {primaryCtaText && primaryCtaLink && (
              <Link to={primaryCtaLink}>
                <Button size="lg" className="w-full sm:w-auto">
                  {primaryCtaText}
                </Button>
              </Link>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <Link to={secondaryCtaLink}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto !border-white !text-white hover:!bg-white/10">
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
