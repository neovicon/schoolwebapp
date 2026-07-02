import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  glass?: boolean;
}

export function StatCard({ title, value, icon, trend, description, glass = false }: StatCardProps) {
  return (
    <Card 
      glass={glass} 
      className={`hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 relative border border-slate-100 dark:border-white/5`}
    >
      <div className="p-6 flex items-start justify-between">
        
        {/* Left Content */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-3xl font-extrabold font-heading bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mt-2">
            {value}
          </span>
          
          {/* Sub-text description / trend */}
          {(trend || description) && (
            <div className="flex items-center gap-2 mt-4">
              {trend && (
                <Badge variant={trend.isPositive ? 'success' : 'danger'} className="gap-0.5 px-1.5 py-0.5 text-[10px]">
                  {trend.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {trend.value}
                </Badge>
              )}
              {description && (
                <span className="text-xs text-slate-400 font-semibold truncate max-w-[150px]">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500/10 to-secondary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-inner shrink-0">
          {icon}
        </div>

      </div>
    </Card>
  );
}
