import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function Contact() {
  const { data: settings } = useSchoolSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      // Simulate API call to Strapi backend
      // await apiClient.post('/messages', { data });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - {settings?.name || 'School'}</title>
      </Helmet>

      <div className="bg-primary-900 py-16 text-center text-white">
        <h1 className="text-4xl font-bold font-heading">Contact Us</h1>
        <p className="mt-4 text-primary-100 max-w-2xl mx-auto">
          We'd love to hear from you. Get in touch with our admissions or support team.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Address</h3>
                <p className="text-slate-600 mt-1">{settings?.address || '123 Education Blvd, City'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Phone</h3>
                <p className="text-slate-600 mt-1">{settings?.contactPhone || '+1 234 567 8900'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-slate-600 mt-1">{settings?.contactEmail || 'info@school.com'}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                Thank you for your message! We will get back to you shortly.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                Something went wrong. Please try again later.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                  placeholder="John Doe"
                />
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  {...register('phone')}
                  placeholder="+1 (555) 000-0000"
                />
                <Input
                  label="Subject"
                  {...register('subject', { required: 'Subject is required' })}
                  error={errors.subject?.message}
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className={`block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ${errors.message ? 'ring-red-500' : 'ring-slate-300 focus:ring-primary-600'
                    } placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all`}
                  {...register('message', { required: 'Message is required' })}
                  placeholder="Your message here..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}