import { motion } from 'framer-motion';
import {
  Sprout, Droplets, Flame, Scissors, Wind, Layers,
  GitCompare, Search, Package, Truck,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { processSteps } from '@/data/site';

const icons = [Sprout, Droplets, Flame, Scissors, Wind, Layers, GitCompare, Search, Package, Truck];

export default function Processing() {
  return (
    <section id="processing" className="py-24 bg-brand-green-dark text-white relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #F6E7C1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="container-px relative">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-eyebrow text-brand-gold">Our Process</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-cream leading-tight mt-3">
            From Raw Cashew to Premium Kernel
          </h2>
          <p className="text-brand-cream/70 mt-4 text-lg">
            A meticulous ten-step process ensuring hygiene, consistency, and exceptional quality.
          </p>
        </Reveal>

        <div className="relative">
          {/* Vertical line for mobile / horizontal connector handled per card */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((step, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={step.name} delay={(i % 5) * 0.08}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="relative h-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 hover:border-brand-gold/40 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-brand-gold" />
                      </div>
                      <span className="font-heading font-bold text-3xl text-white/10">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-brand-cream mb-1.5">{step.name}</h3>
                    <p className="text-sm text-brand-cream/60 leading-relaxed">{step.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
