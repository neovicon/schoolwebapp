import React from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex flex-wrap gap-2 border-b border-slate-200 ${className}`}>
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors rounded-t-lg hover:bg-slate-50 focus:outline-none ${
              isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
