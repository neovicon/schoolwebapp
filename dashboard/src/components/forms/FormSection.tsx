import { Card, CardHeader, CardBody } from '../ui/Card';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className = '' }: FormSectionProps) {
  return (
    <Card className={`border border-slate-100 dark:border-white/5 ${className}`}>
      
      {/* Title Header */}
      <CardHeader className="flex flex-col text-left">
        <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
            {description}
          </p>
        )}
      </CardHeader>

      {/* Grid Inputs Wrapper */}
      <CardBody className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {children}
        </div>
      </CardBody>

    </Card>
  );
}
