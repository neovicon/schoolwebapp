import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface StatisticsProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: 25, suffix: '+', label: 'Years of Excellence' },
  { value: 2000, suffix: '+', label: 'Students Enrolled' },
  { value: 150, suffix: '+', label: 'Qualified Staff' },
  { value: 98, suffix: '%', label: 'Pass Rate' },
];

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const duration = 2500; // 2.5 seconds
    const fps = 60;
    const frames = duration / (1000 / fps);
    const increment = value / frames;
    
    if (value === 0) return;

    let timer: ReturnType<typeof setInterval>;
    
    // Slight delay to sync with card entry animation
    const timeout = setTimeout(() => {
      timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          // Easing function outExpo for a more natural feel
          const progress = start / value;
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(Math.floor(eased * value));
        }
      }, 1000 / fps);
    }, 400);

    return () => {
      clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  }, [value, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function Statistics({ stats = defaultStats }: StatisticsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      },
    },
  };

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Premium Radial Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[800px] opacity-100 filter blur-[80px] rounded-full pointer-events-none mesh-bg block dark:hidden" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[800px] opacity-100 filter blur-[80px] rounded-full pointer-events-none mesh-bg-dark hidden dark:block" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />

      <div className="container-custom relative z-10">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20 text-sm font-bold text-primary-600 dark:text-primary-400 mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Our Impact
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tighter"
          >
            Global Excellence by the Numbers
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="relative group rounded-3xl p-[2px] bg-gradient-to-b from-primary-400/30 to-slate-200 dark:from-primary-600/30 dark:to-white/5 shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300"
            >
              {/* Inner Card */}
              <div className="absolute inset-[2px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[22px] z-0" />
              
              {/* Subtle hover glow */}
              <div className="absolute inset-[2px] opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-[22px] transition-opacity duration-500 pointer-events-none z-10" />

              <div className="relative h-full rounded-[22px] p-8 lg:p-10 flex flex-col items-center justify-center text-center z-20">
                <div className="text-5xl md:text-6xl font-extrabold font-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 tracking-tighter flex items-center">
                  <Counter value={stat.value} />
                  <span className="ml-1">{stat.suffix}</span>
                </div>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}