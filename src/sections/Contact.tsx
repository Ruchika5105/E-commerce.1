import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building2, User, Hash, AlertCircle, Loader2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { company } from '@/data/site';
import { api } from '@/lib/api';

export default function Contact() {
  type Status = 'idle' | 'submitting' | 'success' | 'error';
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      await api.post('enquiries', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or WhatsApp us directly.');
      return;
    }

    setStatus('success');

    const subject = `Business Enquiry from ${form.name.trim()}`;
    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      form.phone.trim() ? `Phone: ${form.phone.trim()}` : '',
      '',
      `Message:`,
      form.message.trim(),
    ].filter(Boolean).join('\n');
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="py-24 bg-brand-cream/30 dark:bg-gray-900/40">
      <div className="container-px">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-eyebrow">Contact</span>
          <h2 className="section-title mt-3">Let's Talk Business</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Reach out for wholesale, bulk orders, export enquiries, or partnerships.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Info cards + map */}
          <div className="space-y-4">
            {/* Director */}
            <Reveal>
              <div className="rounded-2xl bg-brand-green text-white p-5 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-brand-cream/70 text-xs uppercase tracking-widest font-semibold mb-0.5">{company.director.role}</p>
                  <p className="font-heading font-bold text-xl text-white">{company.director.name}</p>
                </div>
              </div>
            </Reveal>

            {/* Contact persons */}
            <Reveal delay={0.05}>
              <div className="grid sm:grid-cols-2 gap-4">
                {company.contacts.map((c) => (
                  <a
                    key={c.name}
                    href={`tel:${c.phone.replace(/\s/g, '')}`}
                    className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-brand-green" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-brand-green dark:text-brand-cream">{c.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{c.phone}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Reveal>

            {/* Main contacts */}
            <Reveal delay={0.1}>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">Phone / WhatsApp</p>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{company.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{company.phoneAlt}</p>
                  </div>
                </a>
                <a href={`mailto:${company.email}?subject=Business%20Enquiry%20-%20K.Gaureeha%20Food%20Industry&body=Dear%20Team%2C%0A%0AI%20would%20like%20to%20enquire%20about%20your%20cashew%20products.%0A%0AName%3A%20%0APhone%3A%20%0AProduct%20of%20interest%3A%20%0AQuantity%3A%20%0ADelivery%20location%3A%20%0A%0AMessage%3A%20`} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">Email</p>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 break-all">{company.email}</p>
                  </div>
                </a>
              </div>
            </Reveal>

            {/* Addresses */}
            <Reveal delay={0.12}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-brand-gold shrink-0" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-green dark:text-brand-cream">Factory</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{company.factory.line1}<br />{company.factory.line2}<br />{company.factory.line3}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-green dark:text-brand-cream">Office</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{company.office.line1}<br />{company.office.line2}<br />{company.office.line3}</p>
                </div>
              </div>
            </Reveal>

            {/* Reg details + hours */}
            <Reveal delay={0.14}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4 text-brand-gold shrink-0" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-green dark:text-brand-cream">Registration</p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-medium">CIN:</span> {company.cin}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><span className="font-medium">GSTIN:</span> {company.gstin}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-green dark:text-brand-cream">Working Hours</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{company.hours}</p>
                </div>
              </div>
            </Reveal>

            {/* Map */}
            <Reveal delay={0.16}>
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-52">
                <iframe
                  title="K.Gaureeha Food Industry Location"
                  src="https://www.google.com/maps?q=Madhur+Food+Park+Nimzari+Shirpur+Dhule+Maharashtra&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 md:p-8 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
              <h3 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-2">Send Us a Message</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We respond to every business enquiry promptly.</p>
              <div className="space-y-5 flex-1">
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
                <div className="grid sm:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your enquiry — product type, quantity, delivery location..."
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
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : status === 'success' ? (
                    <><CheckCircle2 className="w-5 h-5" /> Message Sent!</>
                  ) : (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                </motion.button>
                {status === 'success' && (
                  <p className="text-center text-sm text-brand-green dark:text-brand-gold font-medium">
                    Thank you! We've received your enquiry and will get back to you shortly.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-center text-sm text-red-600 dark:text-red-400 font-medium flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                  </p>
                )}
                <p className="text-center text-xs text-gray-400">
                  Or WhatsApp us directly at <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-brand-green dark:text-brand-gold font-medium hover:underline">{company.phone}</a>
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
