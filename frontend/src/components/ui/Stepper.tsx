import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary-600 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 border-2 
                  ${isCompleted ? 'bg-primary-600 border-primary-600 text-white' : 
                    isCurrent ? 'bg-white border-primary-600 text-primary-600' : 
                    'bg-white border-slate-300 text-slate-400'}`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span 
                className={`absolute top-12 whitespace-nowrap text-xs sm:text-sm font-medium
                  ${isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-400'}
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
