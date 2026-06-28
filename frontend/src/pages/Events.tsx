import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Calendar as CalendarIcon, MapPin, Clock, List, Grid, Sparkles } from 'lucide-react';
import { Tabs } from '../components/ui/Tabs';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion, AnimatePresence } from 'framer-motion';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const FILTER_TABS = [
  { label: 'All Events', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past Events', value: 'past' },
];

const mockEvents = [
  {
    id: 1,
    title: 'Annual Science Exhibition',
    date: '2026-10-15',
    time: '09:00 AM - 03:00 PM',
    location: 'Main Auditorium',
    description: 'Students from all grades will showcase their innovative science projects and experiments.',
    image: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Inter-School Sports Meet',
    date: '2026-11-20',
    time: '08:00 AM - 05:00 PM',
    location: 'School Sports Complex',
    description: 'A grand sports event featuring track and field, basketball, and football tournaments.',
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Parent-Teacher Meeting',
    date: '2026-12-05',
    time: '10:00 AM - 01:00 PM',
    location: 'Classrooms',
    description: 'Term end review meeting to discuss student progress and academic goals.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Cultural Fest 2026',
    date: '2025-05-10', // Past event
    time: '05:00 PM - 09:00 PM',
    location: 'Open Air Theatre',
    description: 'A celebration of diversity through music, dance, and theatrical performances.',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop'
  }
];

export default function Events() {
  const { data: bgImage } = usePageBackground('events');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data: events = mockEvents, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const response = await fetcher('/events?sort=date:asc&populate=*');
        if (response?.data && response.data.length > 0) {
          return response.data.map((item: any) => ({
            id: item.id,
            ...item
          }));
        }
        return mockEvents;
      } catch (error) {
        console.warn('Failed to fetch events, using mock data.');
        return mockEvents;
      }
    }
  });

  const getFilteredEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter((event: any) => {
      if (filter === 'upcoming') return event.date >= today;
      if (filter === 'past') return event.date < today;
      return true;
    });
  };

  const filteredEvents = getFilteredEvents();

  const formatDateBadge = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate()
    };
  };

  return (
    <>
      <Helmet>
        <title>Events - Global Excellence Academy</title>
        <meta name="description" content="Stay updated with our latest school events, exhibitions, and meets." />
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
            Vibrant Community Life
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">School Events</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Discover what's happening at Global Excellence Academy. Join us in celebrating learning, sports, and culture.
          </p>
        </motion.div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[60vh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <Tabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
            
            <div className="flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200/50 dark:border-white/10 shadow-sm">
              <button 
                onClick={() => setView('grid')}
                className={`p-2.5 rounded-xl transition-all duration-300 ${view === 'grid' ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2.5 rounded-xl transition-all duration-300 ${view === 'list' ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 glass-card rounded-[2.5rem] border border-slate-200/50 dark:border-white/10"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">No Events Found</h3>
              <p className="text-slate-500 dark:text-slate-400 font-light text-lg">There are no events matching your selected filter.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className={view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "space-y-6 max-w-5xl mx-auto"
              }
            >
              <AnimatePresence>
                {filteredEvents.map((event: any, index: number) => {
                  const dateBadge = formatDateBadge(event.date);
                  
                  if (view === 'grid') {
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        key={event.id} 
                        className="glass-card rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/10 transition-all duration-500 group hover:-translate-y-2 flex flex-col h-full"
                      >
                        <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <ImageWithFallback 
                            src={event.image?.url ? event.image.url : event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute top-4 left-4 glass bg-white/90 dark:bg-slate-900/90 rounded-2xl p-2.5 text-center shadow-lg border border-white/20 min-w-[70px]">
                            <span className="block text-primary-600 dark:text-primary-400 font-extrabold text-2xl leading-none">{dateBadge.day}</span>
                            <span className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mt-1 tracking-wider">{dateBadge.month}</span>
                          </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow bg-white/50 dark:bg-slate-900/30">
                          <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight">{event.title}</h3>
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4 text-primary-500" />
                              </div>
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-primary-500" />
                              </div>
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 line-clamp-3 text-base font-light leading-relaxed mt-auto border-t border-slate-100 dark:border-white/5 pt-6">{event.description}</p>
                        </div>
                      </motion.div>
                    );
                  }

                  // List View
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      key={event.id} 
                      className="flex flex-col sm:flex-row glass-card rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/10 transition-all duration-500 group hover:-translate-y-1"
                    >
                      <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800">
                        <ImageWithFallback 
                          src={event.image?.url ? event.image.url : event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-8 sm:p-10 flex flex-col justify-center flex-grow relative bg-white/50 dark:bg-slate-900/30">
                        <div className="hidden sm:block absolute top-10 right-10 glass bg-white/90 dark:bg-slate-900/90 rounded-2xl p-3 text-center shadow-lg border border-white/20 min-w-[70px]">
                          <span className="block text-primary-600 dark:text-primary-400 font-extrabold text-2xl leading-none">{dateBadge.day}</span>
                          <span className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mt-1 tracking-wider">{dateBadge.month}</span>
                        </div>
                        <h3 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-6 pr-24 leading-tight">{event.title}</h3>
                        <div className="flex flex-wrap gap-6 mb-6">
                          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                            <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                            <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-base font-light leading-relaxed">{event.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}