import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Users, Truck, Star, ArrowRight } from 'lucide-react';
import { company, stats } from '@/data/site';
import Reveal from '@/components/Reveal';
import BrandLogo from '@/components/BrandLogo';

const statIcons = [Sparkles, ShieldCheck, Users, Truck];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const dur = 1400;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(start + (value - start) * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Premium cashew processing facility"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/95 via-brand-green-dark/80 to-brand-green-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-transparent to-transparent" />
      </div>

      <div className="container-px relative z-10 py-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start">
          <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cream/15 backdrop-blur-sm border border-brand-cream/20 mb-6"
          >
            <div className="flex items-center gap-0.5 text-brand-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-brand-cream">Google Rating {company.rating}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6"
          >
            Premium Cashew Processing with{' '}
            <span className="text-brand-gold">Quality You Can Trust</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-brand-cream/90 font-body leading-relaxed mb-8 max-w-2xl"
          >
            Delivering carefully processed premium cashews using modern technology while maintaining freshness, hygiene, and exceptional quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-heading font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-all duration-300"
            >
              Explore Products
            </button>
          </motion.div>
        </div>

        {/* Logo badge — prominent on desktop, hidden on mobile to save space */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrandLogo size={180} className="drop-shadow-2xl" />
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-brand-gold/10 blur-3xl -z-10" />
          </div>
        </motion.div>
        </div>

        {/* Animated stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-4xl"
        >
          {stats.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 hover:bg-white/15 transition-colors"
              >
                <Icon className="w-6 h-6 text-brand-gold mb-3" />
                <div className="font-heading font-bold text-2xl md:text-3xl text-white">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-brand-cream/80 mt-1">{s.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      </motion.div>
    </section>
  );
}
