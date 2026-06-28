import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, Sparkles } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { motion } from 'framer-motion';

interface GalleryImage {
  id: string | number;
  url: string;
  alt: string;
}

interface GalleryProps {
  title?: string;
  subtitle?: string;
  images?: GalleryImage[];
}

const defaultImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop', alt: 'Students in classroom' },
  { id: 2, url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop', alt: 'Group discussion' },
  { id: 3, url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop', alt: 'Computer lab' },
  { id: 4, url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000&auto=format&fit=crop', alt: 'Library' },
  { id: 5, url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1000&auto=format&fit=crop', alt: 'Science experiment' },
  { id: 6, url: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=1000&auto=format&fit=crop', alt: 'Sports field' },
];

export default function GallerySection({ title = 'Campus Gallery', subtitle = 'Take a glimpse into daily life at our vibrant campus.', images = defaultImages }: GalleryProps) {
  // Use first 6 images for the masonry grid layout
  const displayImages = images.slice(0, 6);

  if (displayImages.length === 0) return null;

  return (
    <section className="py-32 relative bg-white dark:bg-slate-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/5 filter blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 shadow-sm">
              <ImageIcon className="w-4 h-4 text-primary-500" />
              Life at Campus
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tighter mb-6">{title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light">{subtitle}</p>
          </div>
          <Link 
            to="/gallery" 
            className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-lg active:scale-95 whitespace-nowrap"
          >
            View Full Gallery
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[250px] md:auto-rows-[300px]"
        >
          {displayImages.map((img, index) => {
            // Make the first image span 2 rows for a masonry effect
            const isFeatured = index === 0;
            return (
              <motion.div 
                whileHover={{ y: -8 }}
                key={img.id} 
                className={`group relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${isFeatured ? 'row-span-2' : ''}`}
              >
                <ImageWithFallback 
                  src={img.url} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-white mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-xl">{img.alt}</h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}