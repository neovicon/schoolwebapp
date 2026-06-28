import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Tabs } from '../components/ui/Tabs';
import { Bell, Calendar, ChevronDown, ChevronUp, Download, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion, AnimatePresence } from 'framer-motion';

const FILTER_TABS = [
  { label: 'All Notices', value: 'all' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'Important', value: 'important' },
  { label: 'General', value: 'general' },
];

const mockNotices = [
  {
    id: 1,
    title: 'School Closure Due to Heavy Rain',
    body: 'Please be informed that the school will remain closed tomorrow due to the severe weather warnings issued by the local authorities. Online classes will be conducted as per the regular timetable.',
    priority: 'urgent',
    publishedAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 2,
    title: 'Term 1 Examination Schedule Released',
    body: 'The schedule for the upcoming Term 1 examinations has been finalized and uploaded to the student portal. Exams will commence from the 2nd week of next month. Students are advised to start their preparations.',
    priority: 'important',
    publishedAt: '2026-05-28T10:30:00.000Z',
  },
  {
    id: 3,
    title: 'Call for Articles: Annual School Magazine',
    body: 'We are inviting submissions for the annual school magazine "The Horizon". Students can submit poems, short stories, essays, or artwork. The deadline for submission is the 15th of this month. Please submit your entries to your respective class teachers.',
    priority: 'general',
    publishedAt: '2026-05-25T14:15:00.000Z',
  },
  {
    id: 4,
    title: 'Reminder: PTM for Grades 6-8',
    body: 'This is a gentle reminder that the Parent-Teacher Meeting for grades 6 to 8 is scheduled for this Saturday from 9:00 AM to 12:00 PM. We request all parents to attend and discuss their child\'s progress.',
    priority: 'important',
    publishedAt: '2026-05-20T09:00:00.000Z',
  },
  {
    id: 5,
    title: 'New Library Books Added',
    body: 'Over 200 new titles have been added to the school library, including the latest bestsellers in young adult fiction and new reference materials for science and history. Visit the library to check them out!',
    priority: 'general',
    publishedAt: '2026-05-15T11:45:00.000Z',
  }
];

const priorityConfig = {
  urgent: { badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', line: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
  important: { badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', line: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
  general: { badge: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', line: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' },
};

export default function Notices() {
  const { data: bgImage } = usePageBackground('notices');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: notices = mockNotices, isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      try {
        const response = await fetcher('/notices?sort=publishedAt:desc&populate=*');
        if (response?.data && response.data.length > 0) {
          return response.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            body: item.body,
            priority: item.priority || 'general',
            publishedAt: item.publishedAt,
            attachment: item.attachment?.url
              ? `http://localhost:1337${item.attachment.url}`
              : null
          }));
        }
        return mockNotices;
      } catch (error) {
        console.warn('Failed to fetch notices, using mock data.');
        return mockNotices;
      }
    }
  });

  const filteredNotices = useMemo(() => {
    if (activeFilter === 'all') return notices;
    return notices.filter((notice: any) => notice.priority === activeFilter);
  }, [notices, activeFilter]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>Notice Board - Global Excellence Academy</title>
        <meta name="description" content="Stay updated with the latest notices and announcements." />
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
            Stay Informed
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Notice Board</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Important announcements and updates for students and parents.
          </p>
        </motion.div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[60vh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />

        <div className="container-custom max-w-4xl relative z-10">
          <div className="flex justify-center mb-12">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/50 dark:border-white/10 overflow-x-auto w-full md:w-auto p-1.5">
              <Tabs tabs={FILTER_TABS} value={activeFilter} onChange={setActiveFilter} className="border-none min-w-max bg-transparent p-0 border-0" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredNotices.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 glass-card rounded-[2.5rem] border border-slate-200/50 dark:border-white/10"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">No notices found</h3>
              <p className="text-slate-500 dark:text-slate-400 font-light text-lg">There are no notices matching the selected filter.</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {filteredNotices.map((notice: any) => {
                  const config = priorityConfig[notice.priority as keyof typeof priorityConfig] || priorityConfig.general;
                  const isExpanded = expandedId === notice.id;

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={notice.id} 
                      className={`glass-card rounded-[1.5rem] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-white/10 overflow-hidden relative flex flex-col transition-all duration-300 ${isExpanded ? 'bg-white/80 dark:bg-slate-900/80 ring-1 ring-primary-500/20' : 'bg-white/50 dark:bg-slate-900/30'}`}
                    >
                      {/* Left Border color line with glow */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.line} transition-all duration-300 z-10`}></div>
                      
                      <div 
                        className="p-6 md:p-8 pl-8 md:pl-10 cursor-pointer"
                        onClick={() => toggleExpand(notice.id)}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border ${config.badge}`}>
                                {notice.priority}
                              </span>
                              <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                {new Date(notice.publishedAt).toLocaleDateString(undefined, {
                                  year: 'numeric', month: 'short', day: 'numeric'
                                })}
                              </div>
                            </div>
                            <h3 className={`text-xl md:text-2xl font-bold font-heading transition-colors duration-300 ${isExpanded ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>{notice.title}</h3>
                          </div>
                          <button className={`p-2.5 rounded-xl transition-colors shrink-0 flex items-center justify-center ${isExpanded ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="w-5 h-5" />
                            </motion.div>
                          </button>
                        </div>

                        <AnimatePresence initial={false}>
                          {isExpanded ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-white/10 prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                                {typeof notice.body === 'string' ? (
                                  <ReactMarkdown>{notice.body}</ReactMarkdown>
                                ) : (
                                  <p>{notice.body || 'No details provided.'}</p>
                                )}
                                
                                {notice.attachment && (
                                  <div className="mt-8">
                                    <a 
                                      href={notice.attachment} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl text-sm font-bold transition-colors border border-slate-200/50 dark:border-white/10 shadow-sm"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download Attachment
                                    </a>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <p className="text-slate-600 dark:text-slate-400 line-clamp-2 pr-12 text-base font-light mt-3 leading-relaxed">
                              {typeof notice.body === 'string' ? notice.body.replace(/[#_*\[\]]/g, '') : notice.body}
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
}