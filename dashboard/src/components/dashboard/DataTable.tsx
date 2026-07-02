import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { Database } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  };
}

export function DataTable<T>({ 
  columns, 
  data, 
  isLoading = false,
  emptyState = {
    title: 'No records found',
    description: 'There is currently no data matching your request.',
  }
}: DataTableProps<T>) {

  const renderCellContent = (row: T, col: Column<T>) => {
    if (col.render) {
      return col.render(row);
    }
    const val = row[col.accessorKey as keyof T];
    if (val === undefined || val === null) return '-';
    return String(val);
  };

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'left':
      default:
        return 'text-left';
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full border-collapse text-sm">
        
        {/* Table Header */}
        <thead className="bg-slate-50/75 dark:bg-slate-800/30 border-b border-slate-250/50 dark:border-white/5 select-none">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-6 py-4 font-bold text-slate-500 dark:text-slate-400 tracking-tight text-xs uppercase ${getAlignClass(col.align)}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {isLoading ? (
            <LoadingSkeleton variant="tableRow" count={5} />
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12">
                <EmptyState
                  title={emptyState.title}
                  description={emptyState.description}
                  icon={emptyState.icon || <Database className="w-8 h-8 text-slate-400" />}
                  className="shadow-none border-0 bg-transparent dark:bg-transparent"
                />
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={`px-6 py-4.5 text-slate-700 dark:text-slate-300 font-medium ${getAlignClass(col.align)}`}
                  >
                    {renderCellContent(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}
