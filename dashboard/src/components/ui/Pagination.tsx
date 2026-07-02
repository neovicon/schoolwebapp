import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 my-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        const isActive = pageNum === page;
        
        return (
          <button
            key={pageNum}
            onClick={() => onChange(pageNum)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer ${
              isActive 
                ? 'bg-primary-600 text-white' 
                : 'border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
