import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Stepper } from '../components/ui/Stepper';
import { Tabs } from '../components/ui/Tabs';
import { CheckCircle2, FileText, Send, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/axios';
import { usePageBackground } from '../hooks/usePageBackground';

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
        className="bg-primary-900 py-20 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Admissions</h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            Join our community of lifelong learners. Start your application journey here.
          </p>
        </div>
      </section>

      {/* Process & Requirements */}
      <section className="py-16 bg-slate-50">
        <div className="container-custom grid lg:grid-cols-2 gap-12">
          {/* Admission Process */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">Admission Process</h2>
            <div className="space-y-6">
              {[
                { step: '1', title: 'Submit Inquiry', desc: 'Fill out the online application form below.' },
                { step: '2', title: 'Assessment', desc: 'Candidates will be invited for an entrance test and interaction.' },
                { step: '3', title: 'Document Verification', desc: 'Submit all required documents for verification.' },
                { step: '4', title: 'Offer & Enrollment', desc: 'Accept the offer and pay the admission fees to secure the seat.' },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements & Fees */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">Requirements by Grade</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <Tabs tabs={REQUIREMENT_TABS} value={activeTab} onChange={setActiveTab} />
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Birth Certificate</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Previous Academic Records (if applicable)</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Transfer Certificate (Original)</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>4 Passport size photographs</span>
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold font-heading text-slate-900 mt-12 mb-6">Fee Structure (Annual)</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Grade</th>
                    <th className="px-6 py-4 font-semibold">Admission Fee</th>
                    <th className="px-6 py-4 font-semibold">Tuition (Monthly)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">Pre-Primary</td>
                    <td className="px-6 py-4">$500</td>
                    <td className="px-6 py-4">$200</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">Primary (1-5)</td>
                    <td className="px-6 py-4">$600</td>
                    <td className="px-6 py-4">$250</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">Secondary (6-10)</td>
                    <td className="px-6 py-4">$800</td>
                    <td className="px-6 py-4">$350</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">Admission Inquiry</h2>
            <p className="text-slate-600">Please fill out this form to express your interest. Our admissions team will contact you shortly.</p>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-100">
            <Stepper steps={STEPS} currentStep={currentStep} />

            <div className="mt-10">
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{submitError}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Student Details */}
                {currentStep === 0 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Student's Full Name *</label>
                      <input 
                        type="text" 
                        {...register('studentName', { required: 'Student name is required' })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                      {errors.studentName && <span className="text-red-500 text-xs mt-1">{errors.studentName.message as string}</span>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                        <input 
                          type="date" 
                          {...register('dateOfBirth', { required: 'DOB is required' })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                        {errors.dateOfBirth && <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Grade Applying For *</label>
                        <select 
                          {...register('gradeApplying', { required: 'Grade is required' })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        >
                          <option value="">Select Grade</option>
                          <option value="Pre-Primary">Pre-Primary</option>
                          <option value="Grade 1">Grade 1</option>
                          <option value="Grade 5">Grade 5</option>
                          <option value="Grade 10">Grade 10</option>
                        </select>
                        {errors.gradeApplying && <span className="text-red-500 text-xs mt-1">{errors.gradeApplying.message as string}</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Previous School (if any)</label>
                      <input 
                        type="text" 
                        {...register('previousSchool')}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Parent Details */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Parent/Guardian Name *</label>
                      <input 
                        type="text" 
                        {...register('parentName', { required: 'Parent name is required' })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                      {errors.parentName && <span className="text-red-500 text-xs mt-1">{errors.parentName.message as string}</span>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                        <input 
                          type="tel" 
                          {...register('phone', { required: 'Phone is required' })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                        <input 
                          type="email" 
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                          })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message as string}</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Relation to Student</label>
                        <select 
                          {...register('relation')}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                        <input 
                          type="text" 
                          {...register('occupation')}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Additional Message</label>
                      <textarea 
                        {...register('message')}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Documents Checklist */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
                      <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          Please ensure you have soft copies of the required documents ready. You will be asked to upload them or present them during the campus visit. For now, just review the information you provided and submit your inquiry.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                        <div>
                          <dt className="text-slate-500">Student Name</dt>
                          <dd className="font-medium text-slate-900">{getValues('studentName')}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Grade Applying For</dt>
                          <dd className="font-medium text-slate-900">{getValues('gradeApplying')}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Parent Name</dt>
                          <dd className="font-medium text-slate-900">{getValues('parentName')}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Contact Email</dt>
                          <dd className="font-medium text-slate-900">{getValues('email')}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 3 && (
                  <div className="text-center py-12 animate-in fade-in zoom-in-95">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
                    <p className="text-slate-600 max-w-md mx-auto">
                      Thank you for your interest. We have received your inquiry. Our admissions team will review it and get back to you within 2-3 business days.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                  <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onPrev}
                      disabled={currentStep === 0 || isSubmitting}
                      className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Back
                    </button>

                    {currentStep < 2 ? (
                      <button
                        type="button"
                        onClick={onNext}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || isRateLimited}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        {isSubmitting ? 'Submitting...' : isRateLimited ? `Wait ${cooldownTime}s` : 'Submit Application'}
                        {!isSubmitting && !isRateLimited && <Send className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}