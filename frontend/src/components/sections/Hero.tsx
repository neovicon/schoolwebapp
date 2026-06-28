import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Sparkles, ArrowRight, GraduationCap, Users, Play } from 'lucide-react';

export interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImageUrl?: string;
  backgroundImage?: any;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const marqueeItems = [
  "Top 100 Global Schools", "100% University Placement", "Future-Ready Curriculum", 
  "State-of-the-art Campus", "Award-Winning Faculty", "Global Exchange Programs"
];

export default function Hero({
  title,
  subtitle,
  backgroundImageUrl,
  backgroundImage,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  let finalImageUrl = backgroundImageUrl;
  if (!finalImageUrl && backgroundImage?.url) {
    let url = backgroundImage.url;
    if (url.startsWith('/')) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';
      const serverUrl = apiBase.replace('/api', '');
      url = `${serverUrl}${url}`;
    }
    finalImageUrl = url;
  }

  const defaultImg = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop";
  const bgImage = finalImageUrl || defaultImg;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-[100svh] pt-32 pb-24 overflow-hidden flex flex-col justify-center bg-slate-50 dark:bg-slate-950">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-bg opacity-100 transition-opacity duration-1000 block dark:hidden" />
      <div className="absolute inset-0 mesh-bg-dark opacity-100 transition-opacity duration-1000 hidden dark:block" />
      <div className="absolute inset-0 bg-noise" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary-400/20 rounded-full mix-blend-multiply filter blur-[80px] animate-float opacity-70 dark:opacity-40" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-float-delayed opacity-70 dark:opacity-40" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity }}
        className="container-custom relative z-10 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Text Content */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center pt-10 relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/40 dark:border-white/10 text-sm font-bold text-primary-700 dark:text-primary-300 mb-8 w-fit shadow-[0_4px_20px_rgba(14,165,233,0.15)]">
              <Sparkles className="w-4 h-4 text-secondary-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">Redefining Education for 2026</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] xl:text-[6rem] font-extrabold font-heading tracking-tighter text-slate-900 dark:text-white leading-[1.05]">
              {title}
            </h1>
            
            <p className="mt-8 text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-5">
              {primaryCtaText && primaryCtaLink && (
                <Link to={primaryCtaLink} className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full overflow-hidden transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-[0_20px_40px_rgba(14,165,233,0.4)] hover:-translate-y-1 active:translate-y-0 border border-primary-400/30">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    {primaryCtaText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </Link>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <Link to={secondaryCtaLink} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-slate-900 dark:text-white glass rounded-full hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 active:scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 hover:-translate-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 transition-transform group-hover:scale-110">
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </motion.div>

          {/* Bento Grid Visuals */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-5 mt-16 lg:mt-0 relative z-10">
            {/* Large Image Card */}
            <motion.div variants={itemVariants} className="col-span-2 h-[28rem] rounded-[2rem] overflow-hidden relative group shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-white/20 dark:ring-white/10">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={bgImage} 
                alt="Campus" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="glass w-fit px-4 py-2 rounded-full mb-4">
                  <p className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    Live Campus Tour
                  </p>
                </div>
                <h3 className="text-white text-2xl font-bold font-heading">Experience our state-of-the-art facilities</h3>
              </div>
            </motion.div>

            {/* Small Stat Card 1 */}
            <motion.div variants={itemVariants} className="col-span-1 h-44 rounded-3xl glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-400/10 rounded-full blur-2xl group-hover:bg-primary-400/20 transition-colors duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner border border-primary-50/50 dark:border-primary-700/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-secondary-600 transition-all duration-300">98%</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">University Acceptance</p>
              </div>
            </motion.div>

            {/* Small Stat Card 2 */}
            <motion.div variants={itemVariants} className="col-span-1 h-44 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.2)] group hover:-translate-y-2 transition-all duration-500 border border-slate-700 relative overflow-hidden">
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-secondary-400/20 rounded-full blur-2xl group-hover:bg-secondary-400/30 transition-colors duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Users className="w-6 h-6 text-secondary-300" />
              </div>
              <div>
                <p className="text-4xl font-extrabold font-heading text-white">15:1</p>
                <p className="text-sm font-medium text-slate-300 mt-1">Student-Teacher Ratio</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Marquee Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 py-6 border-t border-white/20 dark:border-white/5 glass z-20"
      >
        <div className="flex animate-marquee whitespace-nowrap items-center gap-16">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-16">
              {item}
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400" />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
