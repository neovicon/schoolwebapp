import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Search, MessageCircle, Sparkles } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';
import { Accordion } from '../components/ui/Accordion';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'academics', label: 'Academics' },
  { id: 'fees', label: 'Fees & Payment' },
  { id: 'general', label: 'General' },
];

const mockFaqs = [
  { id: 1, category: 'admissions', question: 'What is the age criteria for Pre-Primary admission?', answer: 'The child must be 3 years old by March 31st of the academic year for Pre-Primary admission.' },
  { id: 2, category: 'admissions', question: 'Is there an entrance exam?', answer: 'Yes, for grades 1 and above, we conduct a brief assessment in English and Mathematics to understand the child\'s proficiency level.' },
  { id: 3, category: 'academics', question: 'Which curriculum does the school follow?', answer: 'We offer a blended curriculum integrating the best practices of national and international boards, ensuring holistic development.' },
  { id: 4, category: 'academics', question: 'What is the student-teacher ratio?', answer: 'We maintain a strict 15:1 student-teacher ratio to ensure personalized attention for every child.' },
  { id: 5, category: 'fees', question: 'Are fees payable monthly or annually?', answer: 'Tuition fees are payable quarterly or monthly. Admission and annual charges are payable at the start of the academic year.' },
  { id: 6, category: 'fees', question: 'Are there any scholarships available?', answer: 'Yes, we offer merit-based scholarships for high-performing students in Grade 8 and above. Please contact the admissions office for details.' },
  { id: 7, category: 'general', question: 'Do you offer transport facilities?', answer: 'Yes, we provide safe and secure bus transport covering major residential areas within a 15km radius of the school.' },
  { id: 8, category: 'general', question: 'What are the school timings?', answer: 'The school operates from 8:00 AM to 3:00 PM on weekdays. Extracurriculars run until 4:30 PM.' },
  { id: 9, category: 'general', question: 'Are meals provided in school?', answer: 'We have a hygienic cafeteria offering nutritious meals. Students can also bring their own lunch from home.' },
  { id: 10, category: 'academics', question: 'What extracurricular activities are offered?', answer: 'We offer a wide range of activities including robotics, debate, various sports, music, arts, and drama.' }
];

export default function FAQ() {
  const { data: bgImage } = usePageBackground('faq');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: faqs = mockFaqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      try {
        const response = await fetcher('/faqs');
        if (response?.data && response.data.length > 0) {
          return response.data.map((item: any) => ({
            id: item.id,
            ...item.attributes
          }));
        }
        return mockFaqs;
      } catch (error) {
        console.warn('Failed to fetch FAQs, using mock data.');
        return mockFaqs;
      }
    }
  });

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq: any) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  return (
    <>
      <Helmet>
        <title>FAQ - Global Excellence Academy</title>
        <meta name="description" content="Find answers to commonly asked questions about our school." />
      </Helmet>

      {/* Hero Banner */}
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
            We're Here to Help
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Have questions? We're here to help. Find quick answers to common queries below.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-5 pl-14 rounded-full text-slate-900 bg-white/90 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-300 border border-white/20 placeholder:text-slate-500 text-lg"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary-500 transition-colors" />
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[60vh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/5 filter blur-[120px] rounded-full pointer-events-none" />

        <div className="container-custom max-w-4xl relative z-10">
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeCategory === category.id 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-transparent shadow-[0_10px_20px_rgba(14,165,233,0.3)] scale-105' 
                    : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 glass-card rounded-[2.5rem] border border-slate-200/50 dark:border-white/10"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-500 dark:text-slate-400 font-light text-lg">We couldn't find any FAQs matching your search criteria.</p>
            </motion.div>
          ) : (
            <Accordion 
              items={filteredFaqs.map((faq: any) => ({
                id: faq.id,
                title: faq.question,
                content: faq.answer
              }))} 
            />
          )}

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 text-center glass-card relative overflow-hidden rounded-[2.5rem] p-12 border border-slate-200/50 dark:border-white/10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-4">Still have questions?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg font-light max-w-xl mx-auto">If you cannot find the answer to your question in our FAQ, our team is always ready to assist you.</p>
              <a href="/contact" className="inline-flex px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-bold hover:shadow-[0_15px_30px_rgba(14,165,233,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
                Contact Us Today
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}