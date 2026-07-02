import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { ROLE_DEFAULT_ROUTES } from '../../../permissions/roles';
import type { LoginCredentials } from '../../../types/user.types';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    if (!credentials.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email))
      errs.email = 'Enter a valid email address';
    if (!credentials.password) errs.password = 'Password is required';
    else if (credentials.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      await login(credentials);
      // login() sets the user in context — read the role from returned session
      const raw = localStorage.getItem('sp_session');
      if (raw) {
        const s = JSON.parse(raw);
        const destination =
          state?.from?.pathname ?? ROLE_DEFAULT_ROUTES[s.user.role as keyof typeof ROLE_DEFAULT_ROUTES];
        navigate(destination, { replace: true });
      }
    } catch {
      setShakeKey(k => k + 1);
    }
  };

  const handleChange =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'rememberMe' ? e.target.checked : e.target.value;
      setCredentials(prev => ({ ...prev, [field]: value }));
      if (fieldErrors[field as 'email' | 'password']) {
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Branding Panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 flex-col items-center justify-center p-16 text-white">
        {/* Decorative circles */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 rounded-full bg-secondary-400/10 blur-3xl" />
        <div className="absolute top-1/2 right-[-60px] w-48 h-48 rounded-full bg-primary-400/10 blur-2xl" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-start gap-10 max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-heading tracking-tight">SchoolPortal</p>
              <p className="text-white/60 text-sm font-medium">Academic Management System</p>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold font-heading leading-tight text-white">
              Education<br />Elevated.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              A unified portal for administrators, teachers, and students — built for the modern academy.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {[
              { label: 'Students', value: '2,847' },
              { label: 'Teachers', value: '134' },
              { label: 'Schools', value: '7' },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <p className="text-2xl font-extrabold font-heading">{stat.value}</p>
                <p className="text-white/60 text-xs font-semibold mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right Login Form ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950">
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, y: 16 }}
          animate={
            shakeKey > 0
              ? { opacity: 1, x: [0, -10, 10, -8, 8, -4, 4, 0], y: 0 }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: shakeKey > 0 ? 0.5 : 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold font-heading bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              SchoolPortal
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Sign in to access your portal
            </p>
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo credentials hint */}
          <div className="mb-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30">
            <p className="text-xs font-bold text-primary-700 dark:text-primary-400 mb-2 uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-primary-600 dark:text-primary-400/80 font-mono">
              <p>admin@school.edu / admin123 <span className="font-sans font-semibold">(Super Admin)</span></p>
              <p>schooladmin@academy.edu / school123 <span className="font-sans font-semibold">(School Admin)</span></p>
              <p>teacher@academy.edu / teacher123 <span className="font-sans font-semibold">(Teacher)</span></p>
              <p>student@academy.edu / student123 <span className="font-sans font-semibold">(Student)</span></p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={credentials.email}
                  onChange={handleChange('email')}
                  placeholder="you@school.edu"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
                    fieldErrors.email
                      ? 'border-red-400 dark:border-red-600'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
                    fieldErrors.password
                      ? 'border-red-400 dark:border-red-600'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={handleChange('rememberMe')}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In to Portal'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
