import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['All', 'Factory', 'Processing', 'Products', 'Packaging', 'Machinery'];

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export default function Gallery() {
  const [active, setActive] = useState('All');
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('gallery')
      .select('id, src, alt, category')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setImages(data);
        setLoading(false);
      });
  }, []);

  const filtered = active === 'All' ? images : images.filter((g) => g.category === active);

  if (loading) {
    return (
      <section id="gallery" className="py-24">
        <div className="container-px flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  const availableCats = CATEGORIES.filter((c) => c === 'All' || images.some((g) => g.category === c));

  return (
    <section id="gallery" className="py-24">
      <div className="container-px">
        <Reveal className="text-center max-w-3xl mx-auto mb-12">
          <span className="section-eyebrow">Gallery</span>
          <h2 className="section-title mt-3">Inside Our World</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            A glimpse into our facility, processing, products, and packaging.
          </p>
        </Reveal>

        <Reveal className="flex flex-wrap justify-center gap-2.5 mb-10">
          {availableCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-heading font-medium transition-all duration-300 ${
                active === cat
                  ? 'bg-brand-green text-white shadow-md'
                  : 'bg-brand-cream/40 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-cream dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          <AnimatePresence>
            {filtered.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative group rounded-2xl overflow-hidden shadow-md break-inside-avoid"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div>
                    <span className="text-xs text-brand-gold font-semibold uppercase tracking-wider">{img.category}</span>
                    <p className="text-white font-heading font-medium">{img.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
