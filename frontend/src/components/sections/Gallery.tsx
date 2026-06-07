import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">{title}</h2>
            <p className="text-lg text-slate-600">{subtitle}</p>
          </div>
          <Link 
            to="/gallery" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors whitespace-nowrap"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {displayImages.map((img, index) => {
            // Make the first image span 2 rows for a masonry effect
            const isFeatured = index === 0;
            return (
              <div 
                key={img.id} 
                className={`group relative overflow-hidden rounded-2xl bg-slate-100 ${isFeatured ? 'row-span-2' : ''}`}
              >
                <img 
                  src={img.url} 
                  alt={img.alt} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}