import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { fetcher } from '../api/axios';
import { Card, CardBody } from '../components/ui/Card';
import { Mail, BookOpen } from 'lucide-react';

export default function Teachers() {
  const { data, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      try {
        const response = await fetcher('/teachers?populate=*');
        return response?.data || [];
      } catch (error) {
        console.error('Failed to fetch teachers', error);
        return [];
      }
    }
  });

  // Base URL for Strapi uploads if url is relative
  const getUrl = (url: string) => url.startsWith('/') ? `http://localhost:1337${url}` : url;

  return (
    <>
      <Helmet>
        <title>Our Teachers - Global Excellence Academy</title>
      </Helmet>

      <div className="bg-primary-900 py-16 text-center text-white">
        <h1 className="text-4xl font-bold font-heading">Our Teachers</h1>
        <p className="mt-4 text-primary-100 max-w-2xl mx-auto">
          Meet our dedicated team of educators committed to inspiring and guiding our students towards excellence.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No teachers found. Please add teachers in the Strapi admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((teacher: any) => (
              <Card key={teacher.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                {teacher.photo ? (
                  <div className="aspect-square w-full overflow-hidden bg-slate-100">
                    <img 
                      src={getUrl(teacher.photo.url)} 
                      alt={teacher.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-slate-100 flex items-center justify-center">
                    <span className="text-6xl text-slate-300 font-heading">
                      {teacher.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                
                <CardBody className="flex flex-col flex-grow text-center">
                  <h3 className="text-2xl font-semibold mb-1 font-heading text-slate-900">
                    {teacher.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-4">
                    {teacher.subject || 'Faculty'}
                  </p>
                  
                  {teacher.bio && (
                    <p className="text-slate-600 mb-6 flex-grow text-sm">
                      {teacher.bio}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slate-100">
                    {teacher.email && (
                      <a 
                        href={`mailto:${teacher.email}`}
                        className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {teacher.email}
                      </a>
                    )}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <BookOpen className="w-4 h-4" />
                        <span>{teacher.courses.length} Course(s)</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}