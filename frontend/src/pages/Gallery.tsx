import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Tabs } from '../components/ui/Tabs';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageBackground } from '../hooks/usePageBackground';

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
        className="bg-primary-900 py-20 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Photo Gallery</h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            A visual journey through the vibrant life at Global Excellence Academy.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="container-custom">
          <div className="flex justify-center mb-10">
            <Tabs tabs={CATEGORIES} value={activeCategory} onChange={setActiveCategory} />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No photos found</h3>
              <p className="text-slate-500">There are no photos in this category yet.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredImages.map((img: any, index: number) => (
                <div 
                  key={img.id} 
                  className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative shadow-sm border border-slate-200 hover:shadow-md transition-all"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={img.url} 
                    alt={img.title || 'Gallery image'} 
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    {img.title && <h3 className="text-white font-semibold text-lg">{img.title}</h3>}
                    <span className="text-primary-300 text-sm capitalize">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>
            
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
              onClick={showPrev}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
              onClick={showNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] w-full px-16 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={filteredImages[lightboxIndex].url} 
                alt={filteredImages[lightboxIndex].title || 'Gallery image'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              {filteredImages[lightboxIndex].title && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
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