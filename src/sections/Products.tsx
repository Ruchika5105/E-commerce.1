import { CheckCircle2, ArrowRight, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Reveal from '@/components/Reveal';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  badge: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Product[]>('products')
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleQuote = (productName: string) => {
    const msg = `I'd like to request a quote for: ${productName}. Please share pricing and availability.`;
    const contactEl = document.querySelector('#contact');
    const textarea = contactEl?.querySelector('textarea');
    if (textarea) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      setter?.call(textarea, msg);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    contactEl?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section id="products" className="py-24">
        <div className="container-px flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section id="products" className="py-24">
      <div className="container-px">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-eyebrow">Our Products</span>
          <h2 className="section-title mt-3">Premium Cashew Products</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Carefully graded and hygienically packed cashew kernels for every business need.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.1}>
              <div className="group h-full rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-brand-gold text-brand-green-dark text-xs font-heading font-semibold shadow-md">
                    {p.badge}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-2">{p.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 flex-1">{p.description}</p>
                  <div className="flex items-center gap-1.5 text-brand-green dark:text-brand-gold text-sm font-medium mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    Quality Assured
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuote(p.name)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-green text-white font-heading font-semibold text-sm hover:bg-brand-green-dark transition-all hover:-translate-y-0.5 shadow-md shadow-brand-green/20"
                    >
                      <FileText className="w-4 h-4" /> Request Quote
                    </button>
                    <button
                      onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center gap-2 text-brand-green dark:text-brand-gold font-heading font-semibold text-sm group/btn"
                    >
                      Enquire
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
