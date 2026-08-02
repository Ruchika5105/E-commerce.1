import { motion } from 'framer-motion';
import {
  Gem, RefreshCw, Cog, Smile, Tag, Boxes, Truck, ShieldCheck,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { whyChooseUs } from '@/data/site';

const icons = [Gem, RefreshCw, Cog, Smile, Tag, Boxes, Truck, ShieldCheck];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-brand-green-dark text-white relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-green-light/10 blur-3xl" />

      <div className="container-px relative">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-eyebrow text-brand-gold">Why Choose Us</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-cream leading-tight mt-3">
            The K.Gaureeha Advantage
          </h2>
          <p className="text-brand-cream/70 mt-4 text-lg">
            Eight reasons buyers, exporters, and distributors trust us with their cashew supply.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {whyChooseUs.map((w, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={w.name} delay={(i % 4) * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="h-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 hover:border-brand-gold/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-brand-cream mb-1.5">{w.name}</h3>
                  <p className="text-sm text-brand-cream/60 leading-relaxed">{w.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
