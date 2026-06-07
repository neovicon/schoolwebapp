import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Calendar as CalendarIcon, MapPin, Clock, List, Grid } from 'lucide-react';
import { Tabs } from '../components/ui/Tabs';
import { usePageBackground } from '../hooks/usePageBackground';

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
        className="bg-primary-900 py-20 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">School Events</h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            Discover what's happening at Global Excellence Academy. Join us in celebrating learning, sports, and culture.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <Tabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
            
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No Events Found</h3>
              <p className="text-slate-500">There are no events matching your selected filter.</p>
            </div>
          ) : (
            <div className={view === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6 max-w-4xl mx-auto"
            }>
              {filteredEvents.map((event: any) => {
                const dateBadge = formatDateBadge(event.date);
                
                if (view === 'grid') {
                  return (
                    <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={event.image?.url ? `http://localhost:1337${event.image.url}` : event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-center shadow-sm min-w-[60px]">
                          <span className="block text-primary-600 font-bold text-xl leading-none">{dateBadge.day}</span>
                          <span className="block text-slate-500 text-xs font-semibold uppercase mt-1">{dateBadge.month}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold font-heading text-slate-900 mb-3 line-clamp-1">{event.title}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 line-clamp-2 text-sm">{event.description}</p>
                      </div>
                    </div>
                  );
                }

                // List View
                return (
                  <div key={event.id} className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                    <div className="sm:w-1/3 relative h-48 sm:h-auto overflow-hidden shrink-0">
                      <img 
                        src={event.image?.url ? `http://localhost:1337${event.image.url}` : event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-center flex-grow relative">
                      <div className="hidden sm:block absolute top-6 right-6 bg-slate-50 border border-slate-100 rounded-lg p-2 text-center w-[60px]">
                        <span className="block text-primary-600 font-bold text-xl leading-none">{dateBadge.day}</span>
                        <span className="block text-slate-500 text-xs font-semibold uppercase mt-1">{dateBadge.month}</span>
                      </div>
                      <h3 className="text-xl font-semibold font-heading text-slate-900 mb-3 pr-16">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 line-clamp-2 text-sm">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}