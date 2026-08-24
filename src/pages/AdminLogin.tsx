import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, LogIn, UserPlus, Loader2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function AdminLogin() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetFormState = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (mode === 'reset') {
      const { error: resetError } = await resetPassword(email.trim());
      setLoading(false);

      if (resetError) {
        setError(resetError);
        return;
      }

      setSuccessMessage('A password reset link has been sent to your email. Check your inbox and follow the instructions.');
      return;
    }

    const fn = mode === 'signin' ? signIn : signUp;
    const { error: submitError } = await fn(email.trim(), password);
    setLoading(false);

    if (submitError) {
      setError(submitError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 dark:bg-gray-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center mb-8">
            <BrandLogo size={56} />
            <h1 className="font-heading font-bold text-2xl text-brand-green dark:text-brand-cream mt-4">
              {mode === 'signin' ? 'Admin Login' : mode === 'signup' ? 'Create Admin Account' : 'Reset Password'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {mode === 'signin'
                ? 'Sign in to manage enquiries and feedback'
                : mode === 'signup'
                  ? 'Set up your admin account'
                  : 'We will send a secure reset link to your admin email'}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
              <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Sign up creates your account, but you can only access the admin panel if your email is on the allowlist. Only an existing admin can add emails.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Please wait...</>
              ) : mode === 'signin' ? (
                <><LogIn className="w-5 h-5" /> Sign In</>
              ) : mode === 'signup' ? (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              ) : (
                <><KeyRound className="w-5 h-5" /> Send Reset Link</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {mode !== 'reset' && (
              <button
                type="button"
                onClick={() => { setMode('reset'); resetFormState(); }}
                className="block w-full text-sm text-brand-green dark:text-brand-gold font-medium hover:underline"
              >
                Forgot password?
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : mode === 'signup' ? 'signin' : 'signin');
                resetFormState();
              }}
              className="text-sm text-brand-green dark:text-brand-gold font-medium hover:underline"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : mode === 'signup'
                  ? 'Already have an account? Sign in'
                  : 'Back to sign in'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <a href="#home" className="text-xs text-gray-400 hover:text-brand-green dark:hover:text-brand-gold inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to website
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
