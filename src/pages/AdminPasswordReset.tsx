import { useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function AdminPasswordReset() {
  const { user, loading: authLoading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    setSuccess(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 dark:bg-gray-950 px-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size={56} />
          <h1 className="font-heading font-bold text-2xl text-brand-green dark:text-brand-cream mt-4">
            Set a new password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
            {user ? 'Choose a new password for your admin account.' : 'This password reset link is invalid or has expired.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Your password has been updated successfully.</p>
            <a href={`${import.meta.env.BASE_URL}#/admin`} className="btn-primary w-full">Continue to admin login</a>
          </div>
        ) : user ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                placeholder="Enter the password again"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : <><KeyRound className="w-5 h-5" /> Update password</>}
            </button>
          </form>
        ) : (
          <a href={`${import.meta.env.BASE_URL}#/admin`} className="btn-primary w-full">Return to admin login</a>
        )}
      </div>
    </div>
  );
}