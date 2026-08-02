import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { supabase } from '@/lib/supabase';

interface FeedbackEntry {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

export default function Feedback() {
  type Status = 'idle' | 'submitting' | 'success' | 'error';
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [approved, setApproved] = useState<FeedbackEntry[]>([]);

  const loadApproved = useCallback(async () => {
    const { data } = await supabase
      .from('feedback')
      .select('id, name, rating, message, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(6);
    if (data) setApproved(data);
  }, []);

  useEffect(() => {
    loadApproved();
  }, [loadApproved]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('feedback').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      rating,
      message: form.message.trim(),
    });

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    setStatus('success');
    setForm({ name: '', email: '', message: '' });
    setRating(5);
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="feedback" className="py-24">
      <div className="container-px">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-eyebrow">Feedback</span>
          <h2 className="section-title mt-3">Share Your Experience</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            We value your feedback. Tell us about your experience working with K.Gaureeha.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <Reveal>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 md:p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-2">Leave Feedback</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your feedback may be featured on our site after review.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${n} stars`}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${(hoverRating || rating) >= n ? 'text-brand-gold fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Feedback</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  disabled={status === 'submitting'}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                  ) : status === 'success' ? (
                    <><CheckCircle2 className="w-5 h-5" /> Feedback Sent!</>
                  ) : (
                    <>Submit Feedback <Send className="w-4 h-4" /></>
                  )}
                </motion.button>
                {status === 'success' && (
                  <p className="text-center text-sm text-brand-green dark:text-brand-gold font-medium">
                    Thank you! Your feedback has been received and will appear after review.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-center text-sm text-red-600 dark:text-red-400 font-medium flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                  </p>
                )}
              </div>
            </form>
          </Reveal>

          {/* Approved feedback list */}
          <Reveal delay={0.1}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 md:p-8 border border-gray-100 dark:border-gray-700 h-full">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-brand-gold" />
                <h3 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream">What Customers Say</h3>
              </div>
              {approved.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Star className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Be the first to share your feedback!</p>
                </div>
              ) : (
                <div className="space-y-5 max-h-[28rem] overflow-y-auto pr-1">
                  {approved.map((f) => (
                    <div key={f.id} className="border-b border-gray-100 dark:border-gray-700 pb-5 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-semibold text-brand-green dark:text-brand-cream">{f.name}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < f.rating ? 'text-brand-gold fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">"{f.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
