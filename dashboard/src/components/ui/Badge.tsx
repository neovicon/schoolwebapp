
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    primary: 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400',
    secondary: 'bg-secondary-500/10 text-secondary-600 dark:bg-secondary-500/20 dark:text-secondary-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
