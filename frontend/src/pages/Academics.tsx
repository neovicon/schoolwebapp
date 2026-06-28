import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { fetcher } from '../api/axios';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Clock, Users, BookOpen, Sparkles } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function Academics() {
  const { data: bgImage } = usePageBackground('academics');
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const response = await fetcher('/courses?populate=*');
        return response?.data || [];
      } catch (error) {
        console.error('Failed to fetch courses', error);
        return [];
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Academic Programs - Global Excellence Academy</title>
        <meta name="description" content="Explore our diverse range of courses designed to challenge, inspire, and prepare students for a successful future." />
        <meta property="og:title" content="Academic Programs - Global Excellence Academy" />
        <meta property="og:description" content="Explore our diverse range of courses designed to challenge, inspire, and prepare students for a successful future." />
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-primary-500/20 filter blur-[120px] rounded-full pointer-events-none" />
          </>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container-custom relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-bold text-primary-300 mb-6 shadow-lg shadow-primary-500/10">
            <Sparkles className="w-4 h-4 text-primary-400" />
            Excellence in Education
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Academic Programs</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore our diverse range of courses designed to challenge, inspire, and prepare students for a successful future.
          </p>
        </motion.div>
      </section>

      <div className="container-custom py-32 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />

        {isLoading ? (
          <div className="flex justify-center py-20 relative z-10">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-lg relative z-10">
            No courses found. Please add courses in the admin panel.
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
          >
            {data.map((course: any, index: number) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
              <Card className="flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 glass-card border border-slate-200/50 dark:border-white/10 group overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-100 dark:border-white/5 flex items-center gap-5 px-8 pt-8 pb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors duration-500" />
                  
                  <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl shrink-0 shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white line-clamp-2 leading-tight relative z-10">
                    {course.name}
                  </h3>
                </CardHeader>
                
                <CardBody className="flex flex-col flex-grow px-8 pb-8 pt-6 relative bg-white/50 dark:bg-slate-900/30">
                  <p className="text-slate-600 dark:text-slate-400 font-light mb-8 flex-grow whitespace-pre-wrap leading-relaxed text-base">
                    {course.description || 'No description available for this course.'}
                  </p>
                  
                  <div className="space-y-5 pt-6 border-t border-slate-100 dark:border-white/10">
                    {course.teacher && (
                      <div className="flex items-center gap-4 text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 ring-2 ring-primary-100 dark:ring-primary-900/50 shadow-sm">
                          {course.teacher.photo ? (
                            <ImageWithFallback 
                              src={course.teacher.photo.url}
                              alt={course.teacher.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                              {course.teacher.name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary-500 dark:text-primary-400 uppercase tracking-widest mb-1">Instructor</p>
                          <p className="font-bold text-slate-900 dark:text-white text-base">{course.teacher.name}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {course.schedule && (
                        <div className="flex flex-col gap-1 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Schedule</span>
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={course.schedule}>
                            {course.schedule}
                          </span>
                        </div>
                      )}
                      
                      {course.capacity && (
                        <div className="flex flex-col gap-1 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                            <Users className="w-4 h-4" />
                            <span>Capacity</span>
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {course.capacity} max
                          </span>
                        </div>
                      )}
                    </div>
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