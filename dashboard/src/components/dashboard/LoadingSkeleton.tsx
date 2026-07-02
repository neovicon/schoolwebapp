
import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'text' | 'circle' | 'card' | 'tableRow';
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ variant = 'text', className = '', count = 1 }: LoadingSkeletonProps) {
  const baseStyle = 'bg-slate-200 dark:bg-slate-800 animate-pulse';

  const renderSkeleton = () => {
    switch (variant) {
      case 'circle':
        return <div className={`rounded-full ${baseStyle} ${className}`} />;
      
      case 'card':
        return (
          <div className={`p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4 ${className}`}>
            <div className="flex justify-between items-center">
              <div className={`h-4 w-1/3 rounded-md ${baseStyle}`} />
              <div className={`h-10 w-10 rounded-xl ${baseStyle}`} />
            </div>
            <div className={`h-8 w-1/2 rounded-md ${baseStyle} mt-2`} />
            <div className={`h-4 w-2/3 rounded-md ${baseStyle} mt-1`} />
          </div>
        );
      
      case 'tableRow':
        return (
          <tr className={`border-b border-slate-100 dark:border-white/5 animate-pulse ${className}`}>
            <td className="px-6 py-4"><div className={`h-4 w-12 rounded-md ${baseStyle}`} /></td>
            <td className="px-6 py-4"><div className={`h-4 w-32 rounded-md ${baseStyle}`} /></td>
            <td className="px-6 py-4"><div className={`h-4 w-24 rounded-md ${baseStyle}`} /></td>
            <td className="px-6 py-4"><div className={`h-4 w-16 rounded-md ${baseStyle}`} /></td>
            <td className="px-6 py-4 text-right"><div className={`h-8 w-16 rounded-full inline-block ${baseStyle}`} /></td>
          </tr>
        );

      case 'text':
      default:
        return <div className={`h-4 rounded-md w-full ${baseStyle} ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
}
