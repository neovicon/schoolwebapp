import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id?: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full space-y-4">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div 
            key={item.id || index}
            className={`border rounded-xl overflow-hidden transition-colors duration-205 ${
              isOpen 
                ? 'border-primary-200 dark:border-primary-500/30 bg-primary-50/30 dark:bg-primary-950/20' 
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="flex items-center justify-between w-full p-5 text-left focus:outline-none cursor-pointer"
            >
              <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary-700 dark:text-primary-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {item.title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-shrink-0 ml-4 ${isOpen ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-5 pt-0 text-slate-650 dark:text-slate-300 prose prose-slate max-w-none">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
