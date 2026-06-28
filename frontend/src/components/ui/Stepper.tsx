import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full z-0"></div>
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted ? 'var(--color-primary-500)' : isCurrent ? 'var(--color-slate-900)' : 'var(--color-slate-100)',
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-4 border-white dark:border-slate-950 shadow-md
                  ${isCompleted ? 'bg-primary-500 text-white' : 
                    isCurrent ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-950' : 
                    'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
              >
                {isCompleted ? <Check className="w-5 h-5 text-white" /> : index + 1}
              </motion.div>
              <span 
                className={`absolute top-14 whitespace-nowrap text-xs sm:text-sm font-bold transition-colors duration-300
                  ${isCurrent ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}
                  ${index === 0 ? 'left-0 transform-none' : index === steps.length - 1 ? 'right-0 transform-none' : '-translate-x-1/2'}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
