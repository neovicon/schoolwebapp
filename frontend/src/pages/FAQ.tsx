import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import { Search, MessageCircle } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';
import { Accordion } from '../components/ui/Accordion';

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
        className="bg-primary-900 py-20 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-10">
            Have questions? We're here to help. Find quick answers to common queries below.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 rounded-full text-slate-900 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="container-custom max-w-4xl">
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === category.id 
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500">We couldn't find any FAQs matching your search criteria.</p>
            </div>
          ) : (
            <Accordion 
              items={filteredFaqs.map((faq: any) => ({
                id: faq.id,
                title: faq.question,
                content: faq.answer
              }))} 
            />
          )}

          <div className="mt-16 text-center bg-primary-50 rounded-2xl p-8 border border-primary-100">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Still have questions?</h3>
            <p className="text-slate-600 mb-6">If you cannot find the answer to your question in our FAQ, you can always contact us.</p>
            <a href="/contact" className="inline-flex px-6 py-3 bg-white text-primary-600 border border-primary-200 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-sm">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}