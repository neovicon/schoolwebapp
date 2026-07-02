export function getImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';
  const serverUrl = apiBase.replace('/api', '');
  return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
