import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { getImageUrl } from '../../utils/image';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  fallbackText?: string;
}

export default function ImageWithFallback({ src, alt = 'Image', fallbackText, className, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState<string | null>(null);
  
  const finalSrc = getImageUrl(src);

  if (error || !finalSrc) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 ${className || ''}`}>
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-medium text-center break-words max-w-full">
          {error ? `Failed to load: ${error}` : (fallbackText || 'Image not found')}
        </span>
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setError(src || 'Unknown URL')}
      {...props}
    />
  );
}
