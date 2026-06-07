import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';

export const usePageBackground = (slug: string) => {
  return useQuery({
    queryKey: ['pageBackground', slug],
    queryFn: async () => {
      try {
        const response = await fetcher(`/page-backgrounds?filters[slug][$eq]=${slug}&populate=*`);
        if (response?.data && response.data.length > 0) {
          const item = response.data[0];
          let bgUrl = item.backgroundImage?.url || item.attributes?.backgroundImage?.data?.attributes?.url;
          if (bgUrl && bgUrl.startsWith('/')) {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';
            const serverUrl = apiBase.replace('/api', '');
            bgUrl = `${serverUrl}${bgUrl}`;
          }
          return bgUrl || null;
        }
        return null;
      } catch (error) {
        console.warn(`Failed to fetch page background for ${slug}`, error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
