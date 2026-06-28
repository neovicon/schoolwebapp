import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Stepper } from '../components/ui/Stepper';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { CheckCircle2, FileText, Send, AlertCircle, Sparkles } from 'lucide-react';
import { apiClient } from '../api/axios';
import { usePageBackground } from '../hooks/usePageBackground';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = ['Student Details', 'Parent Details', 'Documents', 'Confirmation'];

const REQUIREMENT_TABS = [
  { label: 'Pre-Primary', value: 'pre' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Higher Sec.', value: 'higher' },
];

export default function Admissions() {
  const { data: bgImage } = usePageBackground('admissions');
  const [activeTab, setActiveTab] = useState('primary');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  useEffect(() => {
    // Check rate limiting on mount
    const lastSubmitTime = sessionStorage.getItem('admissionFormLastSubmit');
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

  const onNext = async () => {
    let fieldsToValidate: string[] = [];
    if (currentStep === 0) fieldsToValidate = ['studentName', 'gradeApplying', 'dateOfBirth'];
    if (currentStep === 1) fieldsToValidate = ['parentName', 'phone', 'email'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const onPrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: any) => {
    if (isRateLimited) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await apiClient.post('/admission-inquiries', { data });
      
      setCurrentStep(3); // Confirmation
      sessionStorage.setItem('admissionFormLastSubmit', Date.now().toString());
      setIsRateLimited(true);
      setCooldownTime(60);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admissions - Global Excellence Academy</title>
        <meta name="description" content="Apply for admission at Global Excellence Academy." />
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
            <div className="absolute inset-0 bg-noise opacity-50"></div>
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
            Admissions 2026
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-6 tracking-tighter">Join Our Community</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Begin your journey towards global excellence. Our application process is designed to be seamless.
          </p>
        </motion.div>
      </section>

      {/* Process & Requirements */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-400/5 filter blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-custom grid lg:grid-cols-2 gap-16 relative z-10">
          {/* Admission Process */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mb-10 tracking-tight">Admission Process</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
              {[
                { step: '1', title: 'Submit Inquiry', desc: 'Fill out the online application form below.' },
                { step: '2', title: 'Assessment', desc: 'Candidates will be invited for an entrance test and interaction.' },
                { step: '3', title: 'Document Verification', desc: 'Submit all required documents for verification.' },
                { step: '4', title: 'Offer & Enrollment', desc: 'Accept the offer and pay the admission fees to secure the seat.' },
              ].map((item, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-bold shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-card p-6 rounded-2xl group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Requirements & Fees */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mb-10 tracking-tight">Requirements & Fees</h2>
            <div className="glass-card rounded-[2rem] overflow-hidden mb-12 border border-slate-200/50 dark:border-white/10">
              <Tabs tabs={REQUIREMENT_TABS} value={activeTab} onChange={setActiveTab} className="bg-transparent border-b border-slate-200 dark:border-white/10 rounded-none p-2" />
              <div className="p-8">
                <ul className="space-y-4">
                  {[
                    'Birth Certificate',
                    'Previous Academic Records (if applicable)',
                    'Transfer Certificate (Original)',
                    '4 Passport size photographs'
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300">
                      <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-lg">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/10">
              <div className="px-8 py-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fee Structure (Annual)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm lg:text-base">
                  <thead className="text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-8 py-5 font-semibold">Grade</th>
                      <th className="px-8 py-5 font-semibold">Admission Fee</th>
                      <th className="px-8 py-5 font-semibold">Tuition (Monthly)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">Pre-Primary</td>
                      <td className="px-8 py-5">$500</td>
                      <td className="px-8 py-5">$200</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">Primary (1-5)</td>
                      <td className="px-8 py-5">$600</td>
                      <td className="px-8 py-5">$250</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">Secondary (6-10)</td>
                      <td className="px-8 py-5">$800</td>
                      <td className="px-8 py-5">$350</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
        
        <div className="container-custom max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-secondary-500/20 text-sm font-bold text-secondary-600 dark:text-secondary-400 mb-6 shadow-sm">
              <Send className="w-4 h-4" />
              Apply Today
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-white mb-6 tracking-tighter">Admission Inquiry</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto">Please fill out this form to express your interest. Our admissions team will contact you shortly.</p>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-slate-200/50 dark:border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
            <Stepper steps={STEPS} currentStep={currentStep} />

            <div className="mt-12 relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {submitError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-8 p-6 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-2xl flex items-start gap-4 border border-red-100 dark:border-red-500/20"
                  >
                    <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                    <p className="font-medium text-lg">{submitError}</p>
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Step 1: Student Details */}
                  {currentStep === 0 && (
                    <motion.div 
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <Input 
                        label="Student's Full Name *"
                        placeholder="John Doe"
                        {...register('studentName', { required: 'Student name is required' })}
                        error={errors.studentName?.message as string}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          type="date"
                          label="Date of Birth *"
                          {...register('dateOfBirth', { required: 'DOB is required' })}
                          error={errors.dateOfBirth?.message as string}
                        />
                        <div className="w-full">
                          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 mb-2">Grade Applying For *</label>
                          <select 
                            {...register('gradeApplying', { required: 'Grade is required' })}
                            className="block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 ring-1 ring-inset ring-slate-200 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 shadow-sm transition-all duration-300 outline-none"
                          >
                            <option value="">Select Grade</option>
                            <option value="Pre-Primary">Pre-Primary</option>
                            <option value="Grade 1">Grade 1</option>
                            <option value="Grade 5">Grade 5</option>
                            <option value="Grade 10">Grade 10</option>
                          </select>
                          {errors.gradeApplying && <span className="text-red-500 text-sm mt-2 block font-medium">{errors.gradeApplying.message as string}</span>}
                        </div>
                      </div>
                      <Input 
                        label="Previous School (if any)"
                        placeholder="Previous School Name"
                        {...register('previousSchool')}
                      />
                    </motion.div>
                  )}

                  {/* Step 2: Parent Details */}
                  {currentStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <Input 
                        label="Parent/Guardian Name *"
                        placeholder="Jane Doe"
                        {...register('parentName', { required: 'Parent name is required' })}
                        error={errors.parentName?.message as string}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          type="tel"
                          label="Phone Number *"
                          placeholder="+1 (555) 000-0000"
                          {...register('phone', { required: 'Phone is required' })}
                          error={errors.phone?.message as string}
                        />
                        <Input 
                          type="email"
                          label="Email Address *"
                          placeholder="jane@example.com"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                          })}
                          error={errors.email?.message as string}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="w-full">
                          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 mb-2">Relation to Student</label>
                          <select 
                            {...register('relation')}
                            className="block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 ring-1 ring-inset ring-slate-200 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 shadow-sm transition-all duration-300 outline-none"
                          >
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Guardian">Guardian</option>
                          </select>
                        </div>
                        <Input 
                          label="Occupation"
                          placeholder="Software Engineer"
                          {...register('occupation')}
                        />
                      </div>
                      <Input 
                        multiline
                        rows={4}
                        label="Additional Message"
                        placeholder="Any questions or special notes..."
                        {...register('message')}
                      />
                    </motion.div>
                  )}

                  {/* Step 3: Documents Checklist */}
                  {currentStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-[2rem] border border-primary-100 dark:border-primary-500/20 flex flex-col sm:flex-row items-start gap-6 shadow-sm">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm shrink-0 text-primary-600 dark:text-primary-400">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100 mb-3">Important Notice</h3>
                          <p className="text-lg text-primary-800/80 dark:text-primary-200/80 leading-relaxed font-light">
                            Please ensure you have soft copies of the required documents ready. You will be asked to upload them or present them during the campus visit. For now, just review the information you provided and submit your inquiry.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Summary</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                          <div className="glass p-4 rounded-xl">
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Student Name</dt>
                            <dd className="text-lg font-bold text-slate-900 dark:text-white">{getValues('studentName')}</dd>
                          </div>
                          <div className="glass p-4 rounded-xl">
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Grade Applying For</dt>
                            <dd className="text-lg font-bold text-slate-900 dark:text-white">{getValues('gradeApplying')}</dd>
                          </div>
                          <div className="glass p-4 rounded-xl">
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Parent Name</dt>
                            <dd className="text-lg font-bold text-slate-900 dark:text-white">{getValues('parentName')}</dd>
                          </div>
                          <div className="glass p-4 rounded-xl">
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Contact Email</dt>
                            <dd className="text-lg font-bold text-slate-900 dark:text-white">{getValues('email')}</dd>
                          </div>
                        </dl>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <h3 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mb-4">Application Submitted!</h3>
                      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                        Thank you for your interest. We have received your inquiry. Our admissions team will review it and get back to you within 2-3 business days.
                      </p>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  {currentStep < 3 && (
                    <motion.div 
                      layout
                      className="flex justify-between mt-12 pt-8 border-t border-slate-200 dark:border-white/10"
                    >
                      <button
                        type="button"
                        onClick={onPrev}
                        disabled={currentStep === 0 || isSubmitting}
                        className="px-8 py-3.5 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
                      >
                        Back
                      </button>

                      {currentStep < 2 ? (
                        <button
                          type="button"
                          onClick={onNext}
                          className="px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                          Next Step
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || isRateLimited}
                          className="px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3"
                        >
                          {isSubmitting ? 'Submitting...' : isRateLimited ? `Wait ${cooldownTime}s` : 'Submit Application'}
                          {!isSubmitting && !isRateLimited && <Send className="w-5 h-5" />}
                        </button>
                      )}
                    </motion.div>
                  )}
                </form>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}