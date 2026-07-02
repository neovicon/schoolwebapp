import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, description, icon, actionText, onAction, className = '' }: EmptyStateProps) {
  return (
    <Card glass className={`max-w-xl mx-auto border border-dashed border-slate-200 dark:border-white/10 ${className}`}>
      <CardBody className="flex flex-col items-center justify-center text-center p-8 md:p-12">
        
        {/* Animated Orbed Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200/50 dark:from-slate-800 dark:to-slate-850 text-slate-400 dark:text-slate-500 flex items-center justify-center shadow-inner mb-6 relative">
          {icon}
          <div className="absolute inset-0 rounded-2xl bg-primary-500/5 dark:bg-primary-500/10 animate-pulse" />
        </div>

        {/* Info */}
        <h4 className="text-xl font-bold font-heading text-slate-800 dark:text-white leading-tight">
          {title}
        </h4>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mt-2 leading-relaxed">
          {description}
        </p>

        {/* CTA Button */}
        {actionText && onAction && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onAction}
            className="mt-6 shadow-md"
          >
            {actionText}
          </Button>
        )}

      </CardBody>
    </Card>
  );
}
