import React, { useRef } from 'react';
import { Users, GraduationCap, Building, Trophy, Shield, Monitor, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  { id: 1, title: 'Small Class Sizes', description: 'Personalized attention for every student to maximize learning potential.', icon: 'Users' },
  { id: 2, title: 'Experienced Faculty', description: 'Learn from highly qualified educators dedicated to student success.', icon: 'GraduationCap' },
  { id: 3, title: 'Modern Facilities', description: 'State-of-the-art labs, libraries, and sports complexes.', icon: 'Building' },
  { id: 4, title: 'Extracurricular Activities', description: 'A wide range of clubs and sports to develop well-rounded individuals.', icon: 'Trophy' },
  { id: 5, title: 'Safe Environment', description: 'Secure campus with 24/7 monitoring and strict safety protocols.', icon: 'Shield' },
  { id: 6, title: 'Technology-driven Learning', description: 'Integrating modern tech tools for interactive and effective education.', icon: 'Monitor' },
];

const iconMap: Record<string, React.ElementType> = {
  Users, GraduationCap, Building, Trophy, Shield, Monitor
};

const images = [
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2064&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1427504494785-319ce8372ac0?q=80&w=2070&auto=format&fit=crop"
];

function FeatureRow({ feature, index }: { feature: FeatureItem, index: number }) {
  const isEven = index % 2 === 0;
  const Icon = iconMap[feature.icon] || Users;
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  
  return (
    <div ref={ref} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 py-16 lg:py-32`}>
      {/* Image Block */}
      <div className="w-full lg:w-1/2 relative perspective-1000">
        <motion.div 
          initial={{ opacity: 0, rotateY: isEven ? 15 : -15, scale: 0.9 }}
          whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative group"
        >
          <motion.img 
            style={{ y: imgY }}
            src={images[index % images.length]} 
            alt={feature.title} 
            className="absolute inset-0 w-full h-[130%] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80" />
          
          {/* Decorative floating icon inside image */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="absolute bottom-8 right-8 w-20 h-20 rounded-[1.5rem] glass border border-white/30 flex items-center justify-center text-white shadow-2xl"
          >
            <Icon className="w-10 h-10 drop-shadow-md" />
          </motion.div>
        </motion.div>
      </div>

      {/* Text Block */}
      <motion.div 
        style={{ y: textY }}
        className="w-full lg:w-1/2 flex flex-col justify-center relative"
      >
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-500/30 border border-primary-400/20">
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            {feature.title}
          </h3>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            {feature.description}
          </p>
          
          {/* Decorative Line */}
          <div className="mt-8 w-12 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Features({ title = 'Why Families Choose Us', subtitle = 'Discover what makes our school the best choice for your child.', features = defaultFeatures }: FeaturesProps) {
  return (
    <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 filter blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-500/5 filter blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-slate-900/5 dark:bg-white/5 filter blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20 lg:mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-secondary-500/20 text-sm font-bold text-secondary-600 dark:text-secondary-400 mb-6">
            <Sparkles className="w-4 h-4 fill-secondary-500" />
            Our Advantages
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">{title}</h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-light">{subtitle}</p>
        </motion.div>
        
        <div className="flex flex-col">
          {features.map((feature, index) => (
            <FeatureRow key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}