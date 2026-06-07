import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { fetcher } from '../api/axios';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Clock, Users, BookOpen } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';

export default function Academics() {
  const { data: bgImage } = usePageBackground('academics');
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const response = await fetcher('/courses?populate=*');
        return response?.data || [];
      } catch (error) {
        console.error('Failed to fetch courses', error);
        return [];
      }
    }
  });

  const strapiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';
  const getUrl = (url: string) => url.startsWith('/') ? `${strapiBaseUrl}${url}` : url;

  return (
    <>
      <Helmet>
        <title>Academic Programs - Global Excellence Academy</title>
        <meta name="description" content="Explore our diverse range of courses designed to challenge, inspire, and prepare students for a successful future." />
        <meta property="og:title" content="Academic Programs - Global Excellence Academy" />
        <meta property="og:description" content="Explore our diverse range of courses designed to challenge, inspire, and prepare students for a successful future." />
      </Helmet>

      <section 
        className="bg-primary-900 py-16 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-bold font-heading">Academic Programs</h1>
          <p className="mt-4 text-primary-100 max-w-2xl mx-auto">
            Explore our diverse range of courses designed to challenge, inspire, and prepare students for a successful future.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No courses found. Please add courses in the Strapi admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {data.map((course: any) => (
              <Card key={course.id} className="flex flex-col h-full hover:border-primary-200 transition-colors">
                <CardHeader className="bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-primary-100 text-primary-600 rounded-lg shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold font-heading text-slate-900 line-clamp-2">
                    {course.name}
                  </h3>
                </CardHeader>
                
                <CardBody className="flex flex-col flex-grow">
                  <p className="text-slate-600 mb-6 flex-grow whitespace-pre-wrap">
                    {course.description || 'No description available for this course.'}
                  </p>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    {course.teacher && (
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          {course.teacher.photo ? (
                            <img 
                              src={getUrl(course.teacher.photo.url)}
                              alt={course.teacher.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 bg-slate-200">
                              {course.teacher.name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Instructor</p>
                          <p className="text-slate-500">{course.teacher.name}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {course.schedule && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                          <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                          <span className="truncate" title={course.schedule}>
                            {course.schedule}
                          </span>
                        </div>
                      )}
                      
                      {course.capacity && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                          <Users className="w-4 h-4 text-primary-500 shrink-0" />
                          <span>{course.capacity} max</span>
                        </div>
                      )}
                    </div>
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