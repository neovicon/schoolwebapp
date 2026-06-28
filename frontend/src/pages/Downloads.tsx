import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { FileText, Download as DownloadIcon, File, FileCode, FileSpreadsheet, FileImage } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { label: 'All Files', value: 'all' },
  { label: 'Syllabus', value: 'syllabus' },
  { label: 'Forms', value: 'forms' },
  { label: 'Circulars', value: 'circulars' },
  { label: 'Results', value: 'results' },
];

const mockDownloads = [
  { id: 1, title: 'Academic Calendar 2026-27', category: 'circulars', description: 'Important dates and holidays for the upcoming academic year.', fileType: 'application/pdf', size: 1.2, date: '2026-05-15', url: '#' },
  { id: 2, title: 'Grade 10 Syllabus', category: 'syllabus', description: 'Complete syllabus and curriculum structure for Grade 10.', fileType: 'application/pdf', size: 3.5, date: '2026-04-10', url: '#' },
  { id: 3, title: 'Admission Form 2026', category: 'forms', description: 'Printable version of the admission application form.', fileType: 'application/msword', size: 0.8, date: '2026-01-05', url: '#' },
  { id: 4, title: 'Term 1 Exam Timetable', category: 'circulars', description: 'Schedule for the first term examinations for all grades.', fileType: 'application/pdf', size: 0.5, date: '2026-08-20', url: '#' },
  { id: 5, title: 'Medical Declaration Form', category: 'forms', description: 'Mandatory form to declare student medical conditions.', fileType: 'application/pdf', size: 0.3, date: '2025-11-12', url: '#' },
  { id: 6, title: 'Fee Structure 2026', category: 'circulars', description: 'Detailed breakdown of tuition and other fees.', fileType: 'application/vnd.ms-excel', size: 0.1, date: '2026-02-28', url: '#' },
];

const getFileIcon = (mimeType: string) => {
  if (!mimeType) return <File className="w-8 h-8 text-slate-400" />;
  if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileCode className="w-8 h-8 text-blue-600" />;
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
  if (mimeType.includes('image')) return <FileImage className="w-8 h-8 text-purple-500" />;
  return <File className="w-8 h-8 text-slate-400" />;
};

const formatSize = (kb: number) => {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

export default function Downloads() {
  const { data: bgImage } = usePageBackground('downloads');
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: downloads = mockDownloads, isLoading } = useQuery({
    queryKey: ['downloads'],
    queryFn: async () => {
      try {
        const response = await fetcher('/downloads?populate=*');
        if (response?.data && response.data.length > 0) {
          return response.data.map((item: any) => ({
            id: item.id,
            title: item.attributes.title,
            category: item.attributes.category,
            description: item.attributes.description,
            fileType: item.attributes.file?.data?.attributes?.mime,
            size: item.attributes.file?.data?.attributes?.size,
            date: item.attributes.publishedAt,
            url: item.attributes.file?.data?.attributes?.url 
              ? `http://localhost:1337${item.attributes.file.data.attributes.url}` 
              : '#'
          }));
        }
        return mockDownloads;
      } catch (error) {
        console.warn('Failed to fetch downloads, using mock data.');
        return mockDownloads;
      }
    }
  });

  const filteredDownloads = useMemo(() => {
    if (activeCategory === 'all') return downloads;
    return downloads.filter((item: any) => item.category === activeCategory);
  }, [downloads, activeCategory]);

  return (
    <>
      <Helmet>
        <title>Downloads - Global Excellence Academy</title>
        <meta name="description" content="Download syllabus, forms, circulars, and results." />
      </Helmet>

      <section 
        className="bg-slate-950 pt-32 pb-20 text-center text-white relative overflow-hidden"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage ? (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
        ) : (
          <>
            <div className="absolute inset-0 mesh-bg-dark opacity-50"></div>
            <div className="absolute inset-0 bg-noise"></div>
          </>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-custom relative z-10"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Resource Center</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Access important documents, forms, syllabus, and circulars easily.
          </p>
        </motion.div>
      </section>

      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="container-custom max-w-5xl">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-8 overflow-x-auto">
            <Tabs tabs={CATEGORIES} value={activeCategory} onChange={setActiveCategory} className="border-none min-w-max" />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredDownloads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No files found</h3>
              <p className="text-slate-500">There are no downloadable resources in this category yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col divide-y divide-slate-100">
              {filteredDownloads.map((item: any) => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50 transition-colors">
                  <div className="p-4 bg-slate-100 rounded-xl shrink-0 self-start md:self-center">
                    {getFileIcon(item.fileType)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <Badge variant={
                        item.category === 'syllabus' ? 'info' :
                        item.category === 'circulars' ? 'warning' :
                        item.category === 'results' ? 'success' : 'primary'
                      }>
                        {item.category}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{typeof item.size === 'number' ? formatSize(item.size) : `${item.size} MB`}</span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 self-start md:self-center mt-4 md:mt-0">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-primary-100 text-primary-600 rounded-lg font-medium hover:bg-primary-50 hover:border-primary-200 transition-colors shadow-sm whitespace-nowrap"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}