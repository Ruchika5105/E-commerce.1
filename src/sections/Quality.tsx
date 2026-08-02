import { motion } from 'framer-motion';
import {
  ShieldCheck, ClipboardCheck, Leaf, Sparkles, Cog, Users, Search, Package,
  Award, BadgeCheck,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { qualityPoints, certifications } from '@/data/site';

const icons = [ShieldCheck, ClipboardCheck, Leaf, Sparkles, Cog, Users, Search, Package];
const certIcons = [BadgeCheck, Award, ShieldCheck];

export default function Quality() {
  return (
    <section id="quality" className="py-24 bg-brand-cream/30 dark:bg-gray-900/40">
      <div className="container-px">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-eyebrow">Quality Assurance</span>
          <h2 className="section-title mt-3">Uncompromising Standards at Every Step</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            From raw material to sealed packaging, quality is built into every stage of our process.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {qualityPoints.map((q, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={q.name} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="font-heading font-semibold text-brand-green dark:text-brand-cream mb-1.5">{q.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{q.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Certifications */}
        <Reveal>
          <div className="text-center mb-10">
            <h3 className="font-heading font-bold text-2xl text-brand-green dark:text-brand-cream mb-2">Certifications</h3>
            <p className="text-gray-600 dark:text-gray-400">Committed to recognized food safety and quality standards.</p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {certifications.map((c, i) => {
            const Icon = certIcons[i];
            return (
              <Reveal key={c.name} delay={i * 0.12}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative rounded-3xl bg-gradient-to-br from-white to-brand-cream/40 dark:from-gray-800 dark:to-gray-900 border border-brand-gold/20 p-8 text-center shadow-md overflow-hidden"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-gold/10" />
                  <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-brand-green/5" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-brand-cream" />
                    </div>
                    <h4 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-1">{c.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{c.desc}</p>
                    <span className="inline-block mt-4 text-xs font-medium text-brand-gold uppercase tracking-wider">
                      Certification Pending
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
