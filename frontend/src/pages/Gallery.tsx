import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Tabs } from '../components/ui/Tabs';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageBackground } from '../hooks/usePageBackground';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const CATEGORIES = [
  { label: 'All Photos', value: 'all' },
  { label: 'Sports', value: 'sports' },
  { label: 'Academics', value: 'academics' },
  { label: 'Events', value: 'events' },
  { label: 'Campus', value: 'campus' },
];

const mockGallery = [
  { id: 1, title: 'Annual Sports Day', category: 'sports', url: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, title: 'Science Lab', category: 'academics', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop' },
  { id: 3, title: 'Library', category: 'campus', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop' },
  { id: 4, title: 'Cultural Dance', category: 'events', url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1000&auto=format&fit=crop' },
  { id: 5, title: 'Basketball Match', category: 'sports', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop' },
  { id: 6, title: 'Computer Lab', category: 'academics', url: 'https://images.unsplash.com/photo-1571260899304-42507011ec6a?q=80&w=1000&auto=format&fit=crop' },
  { id: 7, title: 'Graduation Day', category: 'events', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop' },
  { id: 8, title: 'Main Building', category: 'campus', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop' },
  { id: 9, title: 'Art Exhibition', category: 'events', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop' },
  { id: 10, title: 'Football Field', category: 'sports', url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000&auto=format&fit=crop' },
  { id: 11, title: 'Classroom', category: 'academics', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop' },
  { id: 12, title: 'Cafeteria', category: 'campus', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop' },
];

export default function Gallery() {
  const { data: bgImage } = usePageBackground('gallery');
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: images = mockGallery, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      try {
        const response = await fetcher('/gallery-items?populate=*');
        if (response?.data && response.data.length > 0) {
          return response.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            url: item.image?.url 
              ? `http://localhost:1337${item.image.url}` 
              : ''
          })).filter((img: any) => img.url); // filter out items without images
        }
        return mockGallery;
      } catch (error) {
        console.warn('Failed to fetch gallery, using mock data.');
        return mockGallery;
      }
    }
  });

  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return images;
    return images.filter((img: any) => img.category === activeCategory);
  }, [images, activeCategory]);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev! + 1) % filteredImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <>
      <Helmet>
        <title>Gallery - Global Excellence Academy</title>
        <meta name="description" content="Explore photos of our campus, events, academics, and sports." />
      </Helmet>

      <section 
        className="bg-slate-950 pt-40 pb-24 text-center text-white relative overflow-hidden"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage ? (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>
        ) : (
          <>
            <div className="absolute inset-0 mesh-bg-dark opacity-100"></div>
            <div className="absolute inset-0 bg-noise opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-secondary-500/20 filter blur-[120px] rounded-full pointer-events-none" />
          </>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container-custom relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-bold text-secondary-300 mb-6 shadow-lg shadow-secondary-500/10">
            <Sparkles className="w-4 h-4 text-secondary-400" />
            Moments Captured
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Photo Gallery</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            A visual journey through the vibrant life at Global Excellence Academy.
          </p>
        </motion.div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[60vh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="flex justify-center mb-16">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/50 dark:border-white/10 p-1.5 overflow-x-auto w-full md:w-auto">
              <Tabs tabs={CATEGORIES} value={activeCategory} onChange={setActiveCategory} className="border-none min-w-max bg-transparent p-0 border-0" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 glass-card rounded-[2.5rem] border border-slate-200/50 dark:border-white/10"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">No photos found</h3>
              <p className="text-slate-500 dark:text-slate-400 font-light text-lg">There are no photos in this category yet.</p>
            </motion.div>
          ) : (
            <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              <AnimatePresence>
                {filteredImages.map((img: any, index: number) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={img.id} 
                    className="break-inside-avoid rounded-3xl overflow-hidden cursor-pointer group relative shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-slate-200/50 dark:border-white/10 transition-all duration-500"
                    onClick={() => openLightbox(index)}
                  >
                    <ImageWithFallback 
                      src={img.url} 
                      alt={img.title || 'Gallery image'} 
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      {img.title && <h3 className="text-white font-bold text-2xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.title}</h3>}
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full self-start translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{img.category}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50 bg-black/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </button>
            
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 bg-black/20"
              onClick={showPrev}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 bg-black/20"
              onClick={showNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-6xl max-h-[90vh] w-full px-20 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback 
                src={filteredImages[lightboxIndex].url} 
                alt={filteredImages[lightboxIndex].title || 'Gallery image'}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
              {filteredImages[lightboxIndex].title && (
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <span className="glass bg-black/60 text-white px-6 py-3 rounded-full text-sm font-bold tracking-wide border border-white/10">
                    {filteredImages[lightboxIndex].title}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}