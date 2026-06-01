import React, { Suspense, lazy } from 'react';

// Lazy load section components for performance
const Hero = lazy(() => import('../sections/Hero'));
const Features = lazy(() => import('../sections/Features'));
const Statistics = lazy(() => import('../sections/Statistics'));
const RichText = lazy(() => import('../sections/RichText'));
const Gallery = lazy(() => import('../sections/Gallery'));
const CTA = lazy(() => import('../sections/CTA'));
const Testimonials = lazy(() => import('../sections/Testimonials'));
const FAQ = lazy(() => import('../sections/FAQ'));

export interface Section {
  id: number;
  __component: string;
  [key: string]: any;
}

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.__component}-${section.id || index}`;

        switch (section.__component) {
          case 'sections.hero':
            return (
              <Suspense key={key} fallback={<div className="h-[80vh] bg-slate-100 animate-pulse" />}>
                <Hero {...(section as any)} />
              </Suspense>
            );
          case 'sections.features':
            return (
              <Suspense key={key} fallback={<div className="py-24 bg-slate-50 animate-pulse" />}>
                <Features {...section} />
              </Suspense>
            );
          case 'sections.statistics':
            return (
              <Suspense key={key} fallback={<div className="py-16 bg-primary-900 animate-pulse" />}>
                <Statistics {...section} />
              </Suspense>
            );
          case 'sections.rich-text':
            return (
              <Suspense key={key} fallback={<div className="py-16 bg-white animate-pulse" />}>
                <RichText {...section} />
              </Suspense>
            );
          case 'sections.gallery':
            return (
              <Suspense key={key} fallback={<div className="py-16 bg-slate-50 animate-pulse" />}>
                <Gallery {...section} />
              </Suspense>
            );
          case 'sections.cta':
            return (
              <Suspense key={key} fallback={<div className="py-16 bg-primary-50 animate-pulse" />}>
                <CTA {...section} />
              </Suspense>
            );
          case 'sections.testimonials':
            return (
              <Suspense key={key} fallback={<div className="py-24 bg-white animate-pulse" />}>
                <Testimonials {...section} />
              </Suspense>
            );
          case 'sections.faq':
            return (
              <Suspense key={key} fallback={<div className="py-24 bg-slate-50 animate-pulse" />}>
                <FAQ {...section} />
              </Suspense>
            );
          default:
            console.warn(`Unknown section component: ${section.__component}`);
            return null;
        }
      })}
    </>
  );
}
