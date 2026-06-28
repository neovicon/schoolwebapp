import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { fetcher } from '../api/axios';
import { Card, CardBody } from '../components/ui/Card';
import { Mail, BookOpen, Sparkles } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function Teachers() {
  const { data: bgImage } = usePageBackground('teachers');
  const { data, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      try {
        const response = await fetcher('/teachers?populate=*');
        return response?.data || [];
      } catch (error) {
        console.error('Failed to fetch teachers', error);
        return [];
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Our Teachers - Global Excellence Academy</title>
        <meta name="description" content="Meet our dedicated team of educators committed to inspiring and guiding our students towards excellence." />
        <meta property="og:title" content="Our Teachers - Global Excellence Academy" />
        <meta property="og:description" content="Meet our dedicated team of educators committed to inspiring and guiding our students towards excellence." />
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
            World-Class Faculty
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Our Teachers</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Meet our dedicated team of educators committed to inspiring and guiding our students towards excellence.
          </p>
        </motion.div>
      </section>

      <div className="container-custom py-32 relative">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        
        {isLoading ? (
          <div className="flex justify-center py-20 relative z-10">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-secondary-500 rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-lg relative z-10">
            No teachers found. Please add teachers in the admin panel.
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10"
          >
            {data.map((teacher: any, index: number) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
              <Card className="flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 glass-card border border-slate-200/50 dark:border-white/10 group overflow-hidden">
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800/50">
                  {teacher.photo ? (
                    <ImageWithFallback 
                      src={teacher.photo.url} 
                      alt={teacher.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <span className="text-6xl text-slate-300 dark:text-slate-600 font-heading font-bold drop-shadow-sm">
                        {teacher.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <CardBody className="flex flex-col flex-grow text-center p-8 bg-white/50 dark:bg-slate-900/30">
                  <h3 className="text-3xl font-bold mb-2 font-heading text-slate-900 dark:text-white">
                    {teacher.name}
                  </h3>
                  <div className="inline-block mx-auto px-4 py-1.5 rounded-full glass border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 font-bold uppercase tracking-widest text-xs mb-6 shadow-sm">
                    {teacher.subject || 'Faculty'}
                  </div>
                  
                  {teacher.bio && (
                    <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow text-base font-light leading-relaxed">
                      {teacher.bio}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-slate-200/50 dark:border-white/10">
                    {teacher.email && (
                      <a 
                        href={`mailto:${teacher.email}`}
                        className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white dark:bg-white/5 py-3 rounded-xl border border-slate-200/50 dark:border-white/5 hover:border-primary-500/30 shadow-sm"
                      >
                        <Mail className="w-4 h-4" />
                        {teacher.email}
                      </a>
                    )}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 py-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <BookOpen className="w-4 h-4" />
                        <span>{teacher.courses.length} Course(s)</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}