import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Tabs } from '../components/ui/Tabs';
import { Bell, Calendar, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { usePageBackground } from '../hooks/usePageBackground';

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
  urgent: { color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  important: { color: 'bg-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  general: { color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
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
        className="bg-primary-900 py-20 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Notice Board</h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            Important announcements and updates for students and parents.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="container-custom max-w-4xl">
          <div className="flex justify-center mb-10">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 overflow-x-auto w-full md:w-auto">
              <Tabs tabs={FILTER_TABS} value={activeFilter} onChange={setActiveFilter} className="border-none min-w-max" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No notices found</h3>
              <p className="text-slate-500">There are no notices matching the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice: any) => {
                const config = priorityConfig[notice.priority as keyof typeof priorityConfig] || priorityConfig.general;
                const isExpanded = expandedId === notice.id;

                return (
                  <div 
                    key={notice.id} 
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col transition-all hover:shadow-md"
                  >
                    {/* Left Border color line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.color}`}></div>
                    
                    <div 
                      className="p-6 pl-8 cursor-pointer"
                      onClick={() => toggleExpand(notice.id)}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${config.bg} ${config.text} ${config.border} border`}>
                              {notice.priority}
                            </span>
                            <div className="flex items-center text-sm text-slate-500">
                              <Calendar className="w-4 h-4 mr-1.5" />
                              {new Date(notice.publishedAt).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })}
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-semibold text-slate-900">{notice.title}</h3>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
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
                            <div className="pt-4 border-t border-slate-100 mt-4 prose prose-sm sm:prose-base text-slate-600 max-w-none">
                              {typeof notice.body === 'string' ? (
                                <ReactMarkdown>{notice.body}</ReactMarkdown>
                              ) : (
                                <p>{notice.body || 'No details provided.'}</p>
                              )}
                              
                              {notice.attachment && (
                                <div className="mt-6">
                                  <a 
                                    href={notice.attachment} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download Attachment
                                  </a>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <p className="text-slate-600 line-clamp-2 pr-12 text-sm md:text-base">
                            {typeof notice.body === 'string' ? notice.body.replace(/[#_*\[\]]/g, '') : notice.body}
                          </p>
                        )}
                      </AnimatePresence>
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