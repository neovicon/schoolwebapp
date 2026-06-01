import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-slate-900 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          <input
            id={inputId}
            ref={ref}
            className={`block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ${
              error ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 focus:ring-primary-600'
            } placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500" id={`${inputId}-description`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
