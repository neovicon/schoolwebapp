import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../../api/auth.api';

type PageState = 'idle' | 'loading' | 'success' | 'error';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pageState, setPageState] = useState<PageState>('idle');
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setPageState('loading');
    try {
      await authApi.forgotPassword({ email });
      setPageState('success');
    } catch {
      setApiError('Something went wrong. Please try again.');
      setPageState('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      {/* Ambient bg */}
      <div className="absolute inset-0 mesh-bg dark:mesh-bg-dark opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold font-heading bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            SchoolPortal
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-[0_20px_60px_rgb(0,0,0,0.4)] p-8">
          <AnimatePresence mode="wait">
            {pageState === 'success' ? (
              /* ── Success State ─────────────────────────────────────────────── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-5 py-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    Check your inbox
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    If <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span> is
                    registered, you'll receive a password reset link within a few minutes.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </motion.div>
            ) : (
              /* ── Form State ────────────────────────────────────────────────── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    Forgot your password?
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                    No problem. Enter your registered email and we'll send you a reset link.
                  </p>
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {pageState === 'error' && apiError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium">{apiError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="forgot-email" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                          if (pageState === 'error') setPageState('idle');
                        }}
                        placeholder="you@school.edu"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
                          emailError
                            ? 'border-red-400 dark:border-red-600'
                            : 'border-slate-200 dark:border-white/10'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">{emailError}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    id="forgot-password-submit"
                    type="submit"
                    disabled={pageState === 'loading'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {pageState === 'loading' ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>

                  {/* Back to login */}
                  <div className="text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
