import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { Award, BookOpen, Users, Globe, Heart, Target, Sparkles, ChevronRight } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function About() {
  const { data: bgImage } = usePageBackground('about');
  const { data: settings } = useSchoolSettings();

  const values = [
    { title: 'Excellence', description: 'Striving for the highest standards in all endeavors.', icon: Award, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Integrity', description: 'Acting with honesty, transparency, and moral courage.', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: 'Innovation', description: 'Embracing new ideas and creative problem-solving.', icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Diversity', description: 'Celebrating differences and fostering an inclusive community.', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Collaboration', description: 'Working together to achieve common goals.', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Lifelong Learning', description: 'Cultivating a continuous thirst for knowledge.', icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-500/10' },
  ];

  const timeline = [
    { year: '1995', title: 'Foundation', description: 'Global Excellence Academy was established with a vision to provide world-class education.' },
    { year: '2002', title: 'Campus Expansion', description: 'Inaugurated the new science wing and state-of-the-art sports complex.' },
    { year: '2010', title: 'International Recognition', description: 'Awarded the prestigious Global Education Award for innovative curriculum.' },
    { year: '2018', title: 'Digital Transformation', description: 'Integrated smart classrooms and 1:1 device programs across all grades.' },
    { year: '2023', title: 'Sustainability Initiative', description: 'Achieved 100% renewable energy usage across the entire campus.' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - {settings?.name || 'Global Excellence Academy'}</title>
        <meta name="description" content="Learn about our history, mission, vision, and core values." />
      </Helmet>

      {/* Hero Banner */}
      <section 
        className="bg-slate-950 pt-40 pb-24 text-center text-white relative overflow-hidden"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage ? (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>
        ) : (
          <>
            <div className="absolute inset-0 mesh-bg-dark opacity-100"></div>
            <div className="absolute inset-0 bg-noise opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-primary-500/20 filter blur-[120px] rounded-full pointer-events-none" />
          </>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container-custom relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-bold text-primary-300 mb-6 shadow-lg shadow-primary-500/10">
            <Sparkles className="w-4 h-4 text-primary-400" />
            Our Story
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">About Us</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Discover our rich history, inspiring mission, and the core values that drive our commitment to educational excellence.
          </p>
        </motion.div>
      </section>

      {/* Principal's Message */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/5 filter blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-5/12"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] ring-1 ring-slate-200/50 dark:ring-white/10 aspect-[4/5] group">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                  alt="Principal" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent p-10 flex flex-col justify-end text-white text-left opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-3xl font-bold font-heading mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">Dr. Sarah Williams</h3>
                  <p className="text-primary-300 font-bold text-lg tracking-wide uppercase translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">Principal</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-7/12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary-500/20 text-sm font-bold text-primary-600 dark:text-primary-400 mb-6 shadow-sm">
                Leadership
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">A Message from the Principal</h2>
              <div className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none font-light leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  Welcome to {settings?.name || 'Global Excellence Academy'}. For over two decades, our institution has been at the forefront of providing holistic, world-class education.
                </p>
                <p>
                  We believe that every child is unique and possesses immense potential. Our role as educators is not just to impart knowledge, but to ignite curiosity, foster critical thinking, and instill values that will guide our students throughout their lives.
                </p>
                <p>
                  In a rapidly changing world, we equip our students with the skills they need to adapt, innovate, and lead. Our dedicated faculty, modern facilities, and rigorous curriculum ensure that our graduates are well-prepared for the challenges and opportunities of the future.
                </p>
                <blockquote className="font-medium text-slate-900 dark:text-white italic mt-10 text-2xl border-l-4 border-primary-500 pl-8 py-2 bg-gradient-to-r from-primary-500/5 to-transparent rounded-r-2xl">
                  "Education is the most powerful weapon which you can use to change the world."
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-200/50 dark:border-white/10 flex flex-col items-center text-center relative overflow-hidden group bg-white/50 dark:bg-slate-900/50"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors duration-500" />
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-6 relative z-10">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light relative z-10">
                To empower students with the knowledge, skills, and values necessary to achieve academic excellence, personal growth, and global citizenship in a nurturing and inclusive environment.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-white/10 flex flex-col items-center text-center relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-800 text-white"
            >
              <div className="absolute top-0 left-0 w-40 h-40 bg-secondary-500/20 rounded-full blur-3xl group-hover:bg-secondary-500/30 transition-colors duration-500" />
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-500 text-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-secondary-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 relative z-10">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold font-heading mb-6 relative z-10">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed text-lg font-light relative z-10">
                To be a globally recognized institution that cultivates lifelong learners, innovative thinkers, and compassionate leaders who positively impact the world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-primary-400/5 filter blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white mb-6 tracking-tight">Our Core Values</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto">The guiding principles that shape our school culture and community.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index} 
                className="glass-card p-10 rounded-[2rem] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 border border-slate-200/50 dark:border-white/10 group flex flex-col items-center text-center bg-white/50 dark:bg-slate-900/30"
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 shadow-md ${value.bg} ${value.color}`}>
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-light text-base leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="container-custom max-w-5xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white mb-6 tracking-tight">Our History</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto">A journey of excellence and continuous growth.</p>
          </div>
          
          <div className="relative before:absolute before:inset-0 before:ml-4 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary-500/20 before:via-primary-500/50 before:to-primary-500/20">
            {timeline.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                key={index} 
                className={`relative flex items-center justify-between md:justify-normal group mb-12 last:mb-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-primary-500 shadow-md -translate-x-1/2 z-10 group-hover:scale-125 group-hover:bg-primary-600 transition-transform duration-300"></div>
                
                <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 glass-card p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/10 shadow-sm group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:-translate-y-1 bg-white/70 dark:bg-slate-900/70 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
                    <span className="text-primary-600 dark:text-primary-400 font-extrabold text-2xl md:text-3xl">{item.year}</span>
                    <h3 className="text-xl md:text-2xl font-bold font-heading text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-light leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
        <div className="container-custom text-center">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-12">Accreditations & Affiliations</h3>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
             {/* Placeholder for logos */}
            <div className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-200 tracking-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cambridge</div>
            <div className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-200 tracking-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors">IB World School</div>
            <div className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-200 tracking-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors">CIS</div>
            <div className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-200 tracking-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors">NEASC</div>
          </div>
        </div>
      </section>
    </>
  );
}