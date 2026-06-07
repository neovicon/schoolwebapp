import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTAProps {
  heading?: string;
  subtext?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export default function CTA({
  heading = 'Ready to Join Our Community?',
  subtext = 'Take the first step towards a brighter future for your child. Explore our programs or start your application today.',
  primaryButtonText = 'Apply Now',
  primaryButtonLink = '/admissions',
  secondaryButtonText = 'Contact Us',
  secondaryButtonLink = '/contact'
}: CTAProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-blue-700"></div>
      
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <div className="container-custom relative z-10 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 max-w-3xl mx-auto leading-tight">
          {heading}
        </h2>
        <p className="text-lg md:text-xl text-primary-50 mb-10 max-w-2xl mx-auto leading-relaxed">
          {subtext}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={primaryButtonLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-full font-semibold hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl group"
          >
            {primaryButtonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to={secondaryButtonLink}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}