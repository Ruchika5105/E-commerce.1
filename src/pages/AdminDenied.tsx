import { ShieldX, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function AdminDenied() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 dark:bg-gray-950 px-6">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size={56} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-5">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            The account <span className="font-semibold text-gray-700 dark:text-gray-300">{user?.email}</span> is not authorized to access the admin panel.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            If you believe this is a mistake, contact the site owner to be added to the admin allowlist.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={signOut}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-heading font-semibold text-white bg-brand-green hover:bg-brand-green-dark transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <a
              href="#home"
              className="text-sm text-brand-green dark:text-brand-gold font-medium hover:underline"
            >
              Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
