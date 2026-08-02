import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import { company } from '@/data/site';
import BrandLogo from '@/components/BrandLogo';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Processing', href: '#processing' },
  { label: 'Quality', href: '#quality' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const productLinks = [
  'Premium Cashew Kernels',
  'Whole Cashews',
  'Split Cashews',
  'Broken Cashews',
  'Bulk Supply',
  'Wholesale Orders',
];

export default function Footer() {
  const handleNav = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-brand-green-dark text-brand-cream/70 pt-16 pb-8">
      <div className="container-px">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company info */}
          <div>
            <div className="mb-3">
              <BrandLogo size={64} />
            </div>
            <p className="text-xs text-brand-gold/80 font-semibold uppercase tracking-wide mb-3">
              Processor of Cashew Nuts &amp; Distributors of Dry Fruits
            </p>
            <p className="text-sm leading-relaxed mb-2">
              {company.director.name} — {company.director.role}
            </p>
            <p className="text-xs text-brand-cream/50 mb-5">
              CIN: {company.cin}<br />GSTIN: {company.gstin}
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href={company.social[Object.keys(company.social)[i] as keyof typeof company.social]}
                  aria-label="Social media"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-brand-green-dark flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <button onClick={() => handleNav(l.href)} className="text-sm hover:text-brand-gold transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2.5">
              {productLinks.map((p) => (
                <li key={p}>
                  <button onClick={() => handleNav('#products')} className="text-sm hover:text-brand-gold transition-colors text-left">
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Reach Us</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-3">
                <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-cream/50 text-xs uppercase tracking-wide mb-0.5">Factory</p>
                  <p>{company.factory.line1}</p>
                  <p>{company.factory.line2}</p>
                  <p>{company.factory.line3}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-cream/50 text-xs uppercase tracking-wide mb-0.5">Office</p>
                  <p>{company.office.line1}, {company.office.line2}, {company.office.line3}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${company.phone.replace(/\s/g,'')}`} className="hover:text-brand-gold transition-colors">{company.phone}</a>
                  <br />
                  <a href={`tel:${company.phoneAlt.replace(/\s/g,'')}`} className="hover:text-brand-gold transition-colors">{company.phoneAlt}</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <a href={`mailto:${company.email}?subject=Business%20Enquiry%20-%20K.Gaureeha%20Food%20Industry&body=Dear%20Team%2C%0A%0AI%20would%20like%20to%20enquire%20about%20your%20cashew%20products.%0A%0AName%3A%20%0APhone%3A%20%0AProduct%20of%20interest%3A%20%0AQuantity%3A%20%0ADelivery%20location%3A%20%0A%0AMessage%3A%20`} className="break-all hover:text-brand-gold transition-colors">{company.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="#/privacy-policy" className="text-brand-cream/40 hover:text-brand-gold transition-colors text-xs">Privacy Policy</a>
            <a href="#/terms-conditions" className="text-brand-cream/40 hover:text-brand-gold transition-colors text-xs">Terms &amp; Conditions</a>
            <a href="#/refund-policy" className="text-brand-cream/40 hover:text-brand-gold transition-colors text-xs">Refund Policy</a>
            <a href="#/admin" className="text-brand-cream/40 hover:text-brand-gold transition-colors text-xs">Admin</a>
            <p className="text-brand-cream/50 text-xs">Shirpur, Dhule, Maharashtra</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
