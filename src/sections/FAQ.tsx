import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { faqs } from '@/data/site';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="container-px max-w-4xl">
        <Reveal className="text-center mb-12">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title mt-3">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Answers to the questions buyers and partners ask us most.
          </p>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.06}>
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={open === i}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5 text-brand-green" />
                    </div>
                    <span className="font-heading font-semibold text-brand-green dark:text-brand-cream">{f.q}</span>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-brand-cream/40 dark:bg-gray-700 flex items-center justify-center text-brand-green">
                    {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 pl-[68px] text-gray-600 dark:text-gray-400 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
