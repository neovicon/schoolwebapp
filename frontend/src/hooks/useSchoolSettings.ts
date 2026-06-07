import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../api/axios';

export interface SchoolSettings {
  name: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  primaryColor?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const emptySettings: SchoolSettings = {
  name: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  primaryColor: '',
  socialLinks: {}
};

export const useSchoolSettings = () => {
  return useQuery({
    queryKey: ['schoolSettings'],
    queryFn: async () => {
      try {
        const data = await fetcher('/school-setting?populate=*');
        if (data?.data) {
          let logoUrl = data.data.logo?.url;
          if (logoUrl && logoUrl.startsWith('/')) {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';
            const serverUrl = apiBase.replace('/api', '');
            logoUrl = `${serverUrl}${logoUrl}`;
          }

          return {
            name: data.data.name || '',
            logoUrl: logoUrl,
            contactEmail: data.data.contactEmail || '',
            contactPhone: data.data.contactPhone || '',
            address: data.data.address || '',
            primaryColor: data.data.primaryColor || '',
            socialLinks: data.data.socialLinks || {},
          } as SchoolSettings;
        }
        return emptySettings;
      } catch (error) {
        console.warn('Failed to fetch school settings from Strapi, using empty data.', error);
        return emptySettings;
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
