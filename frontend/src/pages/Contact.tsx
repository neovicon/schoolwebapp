import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { apiClient } from '../api/axios';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const { data: bgImage } = usePageBackground('contact');
  const { data: settings } = useSchoolSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    const lastSubmitTime = sessionStorage.getItem('contactFormLastSubmit');
    if (lastSubmitTime) {
      const timePassed = (Date.now() - parseInt(lastSubmitTime)) / 1000;
      if (timePassed < 60) {
        setIsRateLimited(true);
        setCooldownTime(Math.ceil(60 - timePassed));
      }
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRateLimited && cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRateLimited, cooldownTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      await apiClient.post('/messages', { 
        data: { ...formData, status: 'new' } 
      });
      
      setSubmitStatus('success');
      setSubmitMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      sessionStorage.setItem('contactFormLastSubmit', Date.now().toString());
      setIsRateLimited(true);
      setCooldownTime(60);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Global Excellence Academy</title>
        <meta name="description" content="Get in touch with Global Excellence Academy." />
      </Helmet>

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
            We're Here for You
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Get in Touch</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Have questions about our programs, admissions, or campus life? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="py-32 bg-slate-50 dark:bg-slate-950 relative min-h-[60vh] overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-400/5 filter blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Contact Info (4 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="glass-card p-10 rounded-[2.5rem] border border-slate-200/50 dark:border-white/10 h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-400/10 rounded-full blur-3xl group-hover:bg-primary-400/20 transition-colors duration-500" />
                
                <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mb-10 tracking-tight">Contact Info</h2>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30 border border-primary-400/20">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">Our Location</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                        {settings?.address || '123 Education Blvd\nCityville, State 12345\nCountry'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30 border border-primary-400/20">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">Phone Number</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-light">
                        <a href={`tel:${settings?.contactPhone}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {settings?.contactPhone || '+1 (234) 567-8900'}
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30 border border-primary-400/20">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">Email Address</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-light">
                        <a href={`mailto:${settings?.contactEmail}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {settings?.contactEmail || 'info@school.com'}
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5 pt-8 border-t border-slate-200 dark:border-white/10">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">Office Hours</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                        Monday - Friday<br />
                        8:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form (8 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-white/10 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-400/10 rounded-full blur-3xl" />
                
                <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">Send a Message</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg font-light relative z-10">Fill out the form below and our team will get back to you within 24 hours.</p>
                
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-10 p-5 bg-green-50 dark:bg-green-500/10 text-green-800 dark:text-green-400 rounded-2xl flex items-start gap-4 border border-green-200 dark:border-green-500/20"
                    >
                      <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                      <p className="font-medium text-lg">{submitMessage}</p>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-10 p-5 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 rounded-2xl flex items-start gap-4 border border-red-200 dark:border-red-500/20"
                    >
                      <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                      <p className="font-medium text-lg">{submitMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={6} 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting || isRateLimited}
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-bold hover:shadow-[0_15px_30px_rgba(14,165,233,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-primary-500/30 border border-primary-400/20"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : isRateLimited ? (
                        `Wait ${cooldownTime}s`
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}