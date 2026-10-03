import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { api } from '@/lib/api';

interface FeedbackEntry {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api
      .get<FeedbackEntry[]>('feedback?limit=10')
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (idx >= testimonials.length) setIdx(0);
  }, [testimonials.length, idx]);

  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[idx];

  if (loading) {
    return (
      <section id="testimonials" className="py-24 bg-brand-cream/30 dark:bg-gray-900/40">
        <div className="container-px flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-brand-cream/30 dark:bg-gray-900/40">
      <div className="container-px">
        <Reveal className="text-center max-w-3xl mx-auto mb-12">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title mt-3">What Our Partners Say</h2>
        </Reveal>

        <Reveal>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-6 -left-2 w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center">
              <Quote className="w-7 h-7 text-brand-gold" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'text-brand-gold fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-body italic mb-6">
                    "{t.message}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center text-brand-cream font-heading font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-heading font-semibold text-brand-green dark:text-brand-cream">{t.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Verified Customer</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button onClick={prev} aria-label="Previous" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1.5">
                  {testimonials.map((entry, i) => (
                    <button
                      key={entry.id}
                      onClick={() => setIdx(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-brand-green' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
                <button onClick={next} aria-label="Next" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
