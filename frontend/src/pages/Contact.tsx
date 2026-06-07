import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetcher } from '../api/axios'; // Or apiClient if they updated it
import { apiClient } from '../api/axios';
import { usePageBackground } from '../hooks/usePageBackground';

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
        className="bg-primary-900 py-20 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us with any questions or inquiries.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Our Location</h3>
                      <p className="text-slate-600 whitespace-pre-line">
                        {settings?.address || '123 Education Blvd\nCityville, State 12345\nCountry'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Phone Number</h3>
                      <p className="text-slate-600">
                        <a href={`tel:${settings?.contactPhone}`} className="hover:text-primary-600 transition-colors">
                          {settings?.contactPhone || '+1 (234) 567-8900'}
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Email Address</h3>
                      <p className="text-slate-600">
                        <a href={`mailto:${settings?.contactEmail}`} className="hover:text-primary-600 transition-colors">
                          {settings?.contactEmail || 'info@school.com'}
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 pt-6 border-t border-slate-100">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Office Hours</h3>
                      <p className="text-slate-600">
                        Monday - Friday<br />
                        8:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2">Send us a Message</h2>
                <p className="text-slate-500 mb-8">Fill out the form below and we'll try to get back to you within 24 hours.</p>
                
                {submitStatus === 'success' && (
                  <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-lg flex items-start gap-3 border border-green-200">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
                    <p>{submitMessage}</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-8 p-4 bg-red-50 text-red-800 rounded-lg flex items-start gap-3 border border-red-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                    <p>{submitMessage}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting || isRateLimited}
                    className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : isRateLimited ? (
                      `Please wait ${cooldownTime}s`
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}