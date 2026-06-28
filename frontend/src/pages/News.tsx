import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetcher } from '../api/axios';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, ChevronRight } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function News() {
  const { data: bgImage } = usePageBackground('news');
  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const response = await fetcher('/news-articles?sort=publishedAt:desc&populate=*');
        return response?.data || [];
      } catch (error) {
        console.warn('Failed to fetch news, using mock data.');
        return [
          {
            id: 1,
            attributes: {
              title: 'Annual Science Fair Winners Announced',
              excerpt: 'Congratulations to all students who participated in this year\'s science fair. The projects were outstanding.',
              publishedAt: '2026-05-15T10:00:00Z',
              slug: 'science-fair-winners',
              coverImage: { data: { attributes: { url: 'https://images.unsplash.com/photo-1564410267841-915d8e4d71ea?q=80&w=600&auto=format&fit=crop' } } }
            }
          },
          {
            id: 2,
            attributes: {
              title: 'New Library Wing Opening Next Month',
              excerpt: 'We are thrilled to announce the grand opening of our new state-of-the-art library wing.',
              publishedAt: '2026-05-01T09:30:00Z',
              slug: 'new-library-wing',
              coverImage: { data: { attributes: { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop' } } }
            }
          }
        ];
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Latest News - Global Excellence Academy</title>
        <meta name="description" content="Stay up to date with the latest stories, announcements, and achievements from our school community." />
        <meta property="og:title" content="Latest News - Global Excellence Academy" />
        <meta property="og:description" content="Stay up to date with the latest stories, announcements, and achievements from our school community." />
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
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Latest News</h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Stay up to date with the latest stories, announcements, and achievements from our school community.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex justify-center"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item: any) => (
              <Card key={item.id} className="flex flex-col">
                {item.attributes.coverImage?.data && (
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <ImageWithFallback 
                      src={item.attributes.coverImage.data.attributes.url} 
                      alt={item.attributes.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                )}
                <CardBody className="flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.attributes.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-heading text-slate-900 line-clamp-2">
                    {item.attributes.title}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">
                    {item.attributes.excerpt}
                  </p>
                  <Link to={`/news/${item.attributes.slug}`} className="mt-auto">
                    <Button variant="ghost" className="w-full justify-between -mx-4 px-4 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                      Read More <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}