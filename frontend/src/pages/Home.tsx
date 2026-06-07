import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';
import SectionRenderer from '../components/sections/SectionRenderer';
import type { Section } from '../components/sections/SectionRenderer';
import { Helmet } from 'react-helmet-async';

// Mock data for the homepage sections
const mockHomeSections: Section[] = [
  {
    id: 1,
    __component: 'blocks.hero',
    title: 'Empowering the Next Generation of Global Leaders',
    subtitle: 'Providing world-class education with a focus on academic excellence, character development, and innovative thinking.',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    primaryCtaText: 'Apply Now',
    primaryCtaLink: '/admissions',
    secondaryCtaText: 'Explore Campus',
    secondaryCtaLink: '/about',
  },
  {
    id: 2,
    __component: 'blocks.features',
  },
  {
    id: 3,
    __component: 'blocks.statistics',
  },
  {
    id: 4,
    __component: 'blocks.testimonial',
  },
  {
    id: 5,
    __component: 'blocks.call-to-action',
  },
  {
    id: 6,
    __component: 'blocks.news-preview',
  }
];

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['page', 'home'],
    queryFn: async () => {
      try {
        const response = await fetcher('/pages?filters[slug][$eq]=home&populate[blocks][populate]=*');
        if (response?.data?.[0]?.blocks) {
          return response.data[0].blocks;
        }
        return mockHomeSections;
      } catch (error) {
        console.warn('Failed to fetch home page from Strapi, using mock data.');
        return mockHomeSections;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const sections = data || mockHomeSections;

  return (
    <>
      <Helmet>
        <title>Home - Global Excellence Academy</title>
        <meta name="description" content="Welcome to Global Excellence Academy." />
      </Helmet>

      <div className="flex flex-col w-full">
        <SectionRenderer sections={sections} />
      </div>
    </>
  );
}