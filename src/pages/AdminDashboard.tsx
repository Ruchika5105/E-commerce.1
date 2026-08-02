import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, MessageSquare, LogOut, Trash2, CheckCircle2, Clock,
  Star, Loader2, Mail, Phone, Calendar, Filter, UserPlus, X,
  Package, Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import BrandLogo from '@/components/BrandLogo';
import { ProductsManager, GalleryManager, ProductRow, GalleryRow } from '@/components/AdminContent';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface FeedbackRow {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
}

interface AdminEmail {
  email: string;
  created_at: string;
}

type Tab = 'enquiries' | 'feedback' | 'products' | 'gallery' | 'admins';
type EnquiryFilter = 'all' | 'new' | 'read';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('enquiries');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [admins, setAdmins] = useState<AdminEmail[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [galleryImgs, setGalleryImgs] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [enquiryFilter, setEnquiryFilter] = useState<EnquiryFilter>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    const [enqRes, fbRes, admRes, prodRes, galRes] = await Promise.all([
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_emails').select('*').order('created_at', { ascending: true }),
      supabase.from('products').select('*').order('sort_order', { ascending: true }),
      supabase.from('gallery').select('*').order('sort_order', { ascending: true }),
    ]);
    if (enqRes.data) setEnquiries(enqRes.data);
    if (fbRes.data) setFeedback(fbRes.data);
    if (admRes.data) setAdmins(admRes.data);
    if (prodRes.data) setProducts(prodRes.data);
    if (galRes.data) setGalleryImgs(galRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markRead = async (id: string) => {
    await supabase.from('enquiries').update({ status: 'read' }).eq('id', id);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'read' } : e)));
  };

  const deleteEnquiry = async (id: string) => {
    await supabase.from('enquiries').delete().eq('id', id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleApprove = async (id: string, current: boolean) => {
    await supabase.from('feedback').update({ approved: !current }).eq('id', id);
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, approved: !current } : f)));
  };

  const deleteFeedback = async (id: string) => {
    await supabase.from('feedback').delete().eq('id', id);
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  };

  const filteredEnquiries = enquiries.filter((e) =>
    enquiryFilter === 'all' ? true : e.status === enquiryFilter
  );

  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const pendingFeedback = feedback.filter((f) => !f.approved).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={36} />
            <div>
              <span className="font-heading font-bold text-brand-green dark:text-brand-cream">Admin Panel</span>
              <span className="block text-[10px] text-gray-400 tracking-widest">K.GAUREEHA FOOD INDUSTRY</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton active={tab === 'enquiries'} onClick={() => setTab('enquiries')} icon={Inbox} label="Enquiries" badge={newCount} />
          <TabButton active={tab === 'products'} onClick={() => setTab('products')} icon={Package} label="Products" />
          <TabButton active={tab === 'gallery'} onClick={() => setTab('gallery')} icon={ImageIcon} label="Gallery" />
          <TabButton active={tab === 'feedback'} onClick={() => setTab('feedback')} icon={MessageSquare} label="Feedback" badge={pendingFeedback} />
          <TabButton active={tab === 'admins'} onClick={() => setTab('admins')} icon={UserPlus} label="Admin Access" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'enquiries' && (
              <motion.div key="enquiries" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-4 h-4 text-gray-400" />
                  {(['all', 'new', 'read'] as EnquiryFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setEnquiryFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                        enquiryFilter === f ? 'bg-brand-green/10 text-brand-green dark:text-brand-gold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                {filteredEnquiries.length === 0 ? (
                  <EmptyState icon={Inbox} label="No enquiries yet" />
                ) : (
                  <div className="space-y-4">
                    {filteredEnquiries.map((e) => (
                      <div key={e.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-semibold text-brand-green dark:text-brand-cream">{e.name}</h3>
                              {e.status === 'new' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold">
                                  <Clock className="w-3 h-3" /> NEW
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1 hover:text-brand-green dark:hover:text-brand-gold">
                                <Mail className="w-3 h-3" /> {e.email}
                              </a>
                              {e.phone && (
                                <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 hover:text-brand-green dark:hover:text-brand-gold">
                                  <Phone className="w-3 h-3" /> {e.phone}
                                </a>
                              )}
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {e.status === 'new' && (
                              <button onClick={() => markRead(e.id)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green dark:text-brand-gold hover:bg-brand-green/20 transition-colors">
                                Mark Read
                              </button>
                            )}
                            <button onClick={() => deleteEnquiry(e.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Delete enquiry">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900 rounded-xl p-3">{e.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'feedback' && (
              <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                {feedback.length === 0 ? (
                  <EmptyState icon={MessageSquare} label="No feedback yet" />
                ) : (
                  <div className="space-y-4">
                    {feedback.map((f) => (
                      <div key={f.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-semibold text-brand-green dark:text-brand-cream">{f.name}</h3>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < f.rating ? 'text-brand-gold fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                              </div>
                              {f.approved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                                  <CheckCircle2 className="w-3 h-3" /> APPROVED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold">
                                  <Clock className="w-3 h-3" /> PENDING
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{f.email} · {new Date(f.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => toggleApprove(f.id, f.approved)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${f.approved ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-brand-green/10 text-brand-green dark:text-brand-gold hover:bg-brand-green/20'}`}>
                              {f.approved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button onClick={() => deleteFeedback(f.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Delete feedback">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900 rounded-xl p-3">{f.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <ProductsManager products={products} setProducts={setProducts} />
              </motion.div>
            )}

            {tab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <GalleryManager images={galleryImgs} setImages={setGalleryImgs} />
              </motion.div>
            )}

            {tab === 'admins' && (
              <motion.div key="admins" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <AdminManager admins={admins} setAdmins={setAdmins} currentEmail={user?.email ?? ''} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-semibold text-sm transition-all ${
        active ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
      {badge !== undefined && badge > 0 && (
        <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-gold text-brand-green-dark text-xs font-bold">{badge}</span>
      )}
    </button>
  );
}

function EmptyState({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Icon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
      <p className="text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function AdminManager({ admins, setAdmins, currentEmail }: { admins: AdminEmail[]; setAdmins: (a: AdminEmail[]) => void; currentEmail: string }) {
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) return;
    setAdding(true);
    setError('');

    const { data, error } = await supabase.from('admin_emails').insert({ email: trimmed }).select().single();
    if (error) {
      setError(error.code === '23505' ? 'This email is already on the allowlist.' : 'Could not add this email. Please try again.');
      setAdding(false);
      return;
    }
    if (data) setAdmins([...admins, data]);
    setNewEmail('');
    setAdding(false);
  };

  const removeAdmin = async (email: string) => {
    if (email === currentEmail) {
      setError("You can't remove your own account while signed in.");
      setTimeout(() => setError(''), 3000);
      return;
    }
    await supabase.from('admin_emails').delete().eq('email', email);
    setAdmins(admins.filter((a) => a.email !== email));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-2">Admin Access</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Only emails on this list can sign in to the admin panel. Add a new email below, then ask that person to create an account on the login page.
        </p>
      </div>

      {/* Add form */}
      <form onSubmit={addAdmin} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Add an admin email</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder="new.admin@email.com"
            />
          </div>
          <button type="submit" disabled={adding} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed px-5">
            {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Add</>}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5"><X className="w-4 h-4" /> {error}</p>}
      </form>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Authorized admins ({admins.length})</p>
        <div className="space-y-3">
          {admins.map((a) => (
            <div key={a.email} className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-brand-green dark:text-brand-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{a.email}</p>
                  {a.email === currentEmail && (
                    <span className="text-xs text-brand-green dark:text-brand-gold font-medium">You</span>
                  )}
                </div>
              </div>
              {a.email !== currentEmail && (
                <button
                  onClick={() => removeAdmin(a.email)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                  aria-label="Remove admin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
