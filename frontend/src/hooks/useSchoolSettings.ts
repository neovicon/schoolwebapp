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

// Mock fallback data while Strapi isn't fully set up
const fallbackSettings: SchoolSettings = {
  name: 'Global Excellence Academy',
  contactEmail: 'info@globalexcellence.edu',
  contactPhone: '+1 (555) 123-4567',
  address: '123 Education Boulevard, Academic City, AC 12345',
  primaryColor: '#0f766e',
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
  }
};

export const useSchoolSettings = () => {
  return useQuery({
    queryKey: ['schoolSettings'],
    queryFn: async () => {
      try {
        const data = await fetcher('/school-setting?populate=*');
        if (data?.data) {
          return {
            name: data.data.attributes?.name || fallbackSettings.name,
            logoUrl: data.data.attributes?.logo?.data?.attributes?.url,
            contactEmail: data.data.attributes?.contactEmail || fallbackSettings.contactEmail,
            contactPhone: data.data.attributes?.contactPhone || fallbackSettings.contactPhone,
            address: data.data.attributes?.address || fallbackSettings.address,
            primaryColor: data.data.attributes?.primaryColor || fallbackSettings.primaryColor,
            socialLinks: data.data.attributes?.socialLinks || fallbackSettings.socialLinks,
          } as SchoolSettings;
        }
        return fallbackSettings;
      } catch (error) {
        console.warn('Failed to fetch school settings from Strapi, using fallback data.', error);
        return fallbackSettings;
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
