import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../api/axios';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Newspaper } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { motion } from 'framer-motion';

export default function NewsPreview() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['latest-news'],
    queryFn: async () => {
      try {
        const response = await fetcher('/articles?sort=publishedAt:desc&pagination[limit]=3&populate=*');
        return response?.data || [];
      } catch (error) {
        console.error('Failed to fetch latest news', error);
        return [];
      }
    }
  });

  if (isLoading || news.length === 0) return null;

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20 text-sm font-bold text-primary-600 dark:text-primary-400 mb-6 shadow-sm">
              <Newspaper className="w-4 h-4" />
              Latest Updates
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-white mb-6 tracking-tighter">News & Insights</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light">Stay informed with what's happening in our vibrant community.</p>
          </div>
          <Link to="/news" className="group inline-flex items-center gap-2 px-8 py-4 glass text-slate-900 dark:text-white rounded-full font-bold hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 border border-white/50 dark:border-white/10 whitespace-nowrap">
            View All News <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {news.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <Link to={`/news/${item.id}`} className="group glass-card rounded-[2rem] overflow-hidden flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 border border-slate-200/50 dark:border-white/10">
                <div className="aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                  {item.attributes?.coverImage?.data ? (
                    <ImageWithFallback 
                      src={item.attributes.coverImage.data.attributes.url} 
                      alt={item.attributes.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {item.attributes?.category && (
                    <span className="absolute top-6 left-6 glass px-4 py-1.5 rounded-full text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-widest shadow-sm">
                      {item.attributes.category}
                    </span>
                  )}
                </div>
                
                <div className="p-8 lg:p-10 flex flex-col flex-grow bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span>
                      {new Date(item.attributes?.publishedAt || item.attributes?.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
                    {item.attributes?.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-3 text-base leading-relaxed mb-8 flex-grow font-light">
                    {item.attributes?.excerpt || 'Read more about this news article and stay up to date...'}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm mt-auto">
                    Read Full Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
