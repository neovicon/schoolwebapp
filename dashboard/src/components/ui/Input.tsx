import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'rows'> {
  label?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className = '', label, error, helperText, id, multiline, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);

    const baseInputStyles = `block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 ring-1 ring-inset shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-300 ${error ? 'ring-red-500/50 focus:ring-red-500 bg-red-50/50 dark:bg-red-500/5' : 'ring-slate-200 dark:ring-white/10 focus:ring-primary-500 dark:focus:ring-primary-400 hover:ring-primary-300 dark:hover:ring-primary-700'
      } ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {multiline ? (
            <textarea
              id={inputId}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={baseInputStyles}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              ref={ref as React.Ref<HTMLInputElement>}
              className={baseInputStyles}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400" id={`${inputId}-description`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
