import { Target, Eye, Gem, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { company } from '@/data/site';

const timeline = [
  { year: 'Sourcing', title: 'Trusted Sourcing', desc: 'Built relationships with reliable raw cashew suppliers.' },
  { year: 'Setup', title: 'Modern Facility', desc: 'Established processing unit at Madhur Food Park.' },
  { year: 'Process', title: 'Process Excellence', desc: 'Implemented strict hygiene and grading standards.' },
  { year: 'Growth', title: 'Trusted Partner', desc: 'Now serving wholesalers, exporters, and food businesses.' },
];

const values = [
  { title: 'Quality First', desc: 'Never compromising on the grade of every kernel we ship.' },
  { title: 'Hygiene', desc: 'Sanitized processes protecting both product and people.' },
  { title: 'Integrity', desc: 'Transparent dealings with every buyer and partner.' },
  { title: 'Consistency', desc: 'Reliable quality and delivery, batch after batch.' },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-brand-cream/30 dark:bg-gray-900/40">
      <div className="container-px">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-eyebrow">About Us</span>
          <h2 className="section-title mt-3">A Dedicated Cashew Processing Company</h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="K.Gaureeha Food Industry modern processing facility"
                className="rounded-3xl shadow-2xl w-full h-[420px] object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 bg-brand-green text-white rounded-2xl p-6 shadow-xl hidden sm:block">
                <div className="font-heading font-bold text-3xl">5.0</div>
                <div className="text-sm text-brand-cream">Google Rating</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-2">{company.subtitle}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
              <span className="font-semibold text-brand-green dark:text-brand-cream">{company.name}</span> is a dedicated cashew processing company located in Madhur Food Park, Nimzari, Maharashtra. We specialize in sourcing, processing, grading, and delivering premium-quality cashew kernels using modern food processing techniques and strict quality control standards.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Our mission is to provide consistently high-quality cashews while maintaining hygiene, freshness, and customer satisfaction.
            </p>
            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-brand-green/5 dark:bg-white/5 border border-brand-green/10">
              <div className="w-11 h-11 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                <span className="font-heading font-bold text-white">KM</span>
              </div>
              <div>
                <p className="font-heading font-semibold text-brand-green dark:text-brand-cream">{company.director.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{company.director.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md">
                <Target className="w-7 h-7 text-brand-green mb-2" />
                <h3 className="font-heading font-semibold text-brand-green dark:text-brand-cream mb-1">Mission</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deliver consistently high-quality, hygienic cashews with complete customer satisfaction.</p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md">
                <Eye className="w-7 h-7 text-brand-gold mb-2" />
                <h3 className="font-heading font-semibold text-brand-green dark:text-brand-cream mb-1">Vision</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Be a trusted, internationally recognized name in premium cashew processing.</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Core values */}
        <Reveal className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Gem className="w-6 h-6 text-brand-gold" />
            <h3 className="font-heading font-bold text-2xl text-brand-green dark:text-brand-cream">Core Values</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                    <Gem className="w-5 h-5 text-brand-green" />
                  </div>
                  <h4 className="font-heading font-semibold text-brand-green dark:text-brand-cream mb-1.5">{v.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal>
          <div className="flex items-center gap-3 mb-10">
            <Calendar className="w-6 h-6 text-brand-gold" />
            <h3 className="font-heading font-bold text-2xl text-brand-green dark:text-brand-cream">Our Journey</h3>
          </div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 h-0.5 bg-brand-green/20 hidden md:block" />
            <div className="grid md:grid-cols-4 gap-8">
              {timeline.map((t, i) => (
                <Reveal key={t.title} delay={i * 0.12}>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center font-heading font-bold text-sm mb-4 relative z-10">
                      {i + 1}
                    </div>
                    <div className="text-brand-gold font-heading font-semibold text-sm uppercase tracking-wide mb-1">{t.year}</div>
                    <h4 className="font-heading font-semibold text-brand-green dark:text-brand-cream mb-1.5">{t.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
