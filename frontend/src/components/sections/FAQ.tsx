import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from '../ui/Accordion';

interface FAQProps {
  title?: string;
  subtitle?: string;
}

const defaultFaqs = [
  {
    title: 'What is the admission process?',
    content: 'Our admission process begins with an online inquiry, followed by a campus tour, an assessment for the student, and finally an offer of enrollment if successful.'
  },
  {
    title: 'What are the school hours?',
    content: 'Regular school hours are from 8:00 AM to 3:00 PM, Monday through Friday. Extracurricular activities usually run from 3:15 PM to 4:30 PM.'
  },
  {
    title: 'Do you offer transportation?',
    content: 'Yes, we have a comprehensive bus network covering most major residential areas. Routes and fees are available upon request.'
  },
  {
    title: 'What is the student-teacher ratio?',
    content: 'We maintain a strict student-teacher ratio of 15:1 to ensure personalized attention for every child.'
  },
  {
    title: 'Are meals provided?',
    content: 'Yes, our cafeteria provides nutritious, balanced meals catering to various dietary requirements. Meal plans can be purchased per term.'
  }
];

export default function FAQSection({ title = 'Frequently Asked Questions', subtitle = 'Find quick answers to common questions about our school.' }: FAQProps) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">{title}</h2>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </div>
        
        <Accordion items={defaultFaqs} />
        
        <div className="mt-12 text-center">
          <Link 
            to="/faq" 
            className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 hover:underline transition-all"
          >
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}