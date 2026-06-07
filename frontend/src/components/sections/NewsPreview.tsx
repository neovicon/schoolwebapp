import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../api/axios';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export default function NewsPreview() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['latest-news'],
    queryFn: async () => {
      try {
        const response = await fetcher('/articles?sort=publishedAt:desc&pagination[limit]=3&populate=*');
        return response?.data || [];
      } catch (error) {
        console.error('Failed to fetch latest news', error);
        return [];
      }
    }
  });

  if (isLoading || news.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">Latest News & Updates</h2>
            <p className="text-lg text-slate-600">Stay informed with what's happening in our school community.</p>
          </div>
          <Link to="/news" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
            View All News <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item: any) => (
            <Link key={item.id} to={`/news/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col h-full">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                {item.attributes?.coverImage?.data ? (
                  <img 
                    src={`http://localhost:1337${item.attributes.coverImage.data.attributes.url}`} 
                    alt={item.attributes.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                    No Image
                  </div>
                )}
                {item.attributes?.category && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.attributes.category}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.attributes?.publishedAt || item.attributes?.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {item.attributes?.title}
                </h3>
                <p className="text-slate-600 line-clamp-3 text-sm mb-6 flex-grow">
                  {item.attributes?.excerpt || 'Read more about this news article...'}
                </p>
                <span className="inline-flex items-center gap-1 text-primary-600 font-medium text-sm mt-auto">
                  Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
