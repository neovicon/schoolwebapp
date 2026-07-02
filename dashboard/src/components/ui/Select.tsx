import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, helperText, id, children, options, ...props }, ref) => {
    const selectId = id || Math.random().toString(36).substring(7);

    const baseSelectStyles = `block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 ring-1 ring-inset shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-300 outline-none ${
      error
        ? 'ring-red-500/50 focus:ring-red-500 bg-red-50/50 dark:bg-red-500/5'
        : 'ring-slate-200 dark:ring-white/10 focus:ring-primary-500 dark:focus:ring-primary-400 hover:ring-primary-300 dark:hover:ring-primary-700'
    } ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={baseSelectStyles}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1" id={`${selectId}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400" id={`${selectId}-description`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
