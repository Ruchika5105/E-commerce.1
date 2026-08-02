import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import BrandLogo from '@/components/BrandLogo';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Processing', href: '#processing' },
  { label: 'Quality', href: '#quality' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Feedback', href: '#feedback' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-px flex items-center justify-between">
        <button onClick={() => handleNav('#home')} className="flex items-center">
          <BrandLogo size={52} className="shrink-0 drop-shadow-md" />
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => handleNav(l.href)}
                className="px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-green dark:hover:text-brand-gold transition-colors rounded-lg hover:bg-brand-cream/30 dark:hover:bg-white/5"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center text-brand-green dark:text-brand-cream hover:bg-brand-cream/40 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => handleNav('#contact')}
            className="hidden sm:inline-flex btn-primary !px-5 !py-2.5 text-sm"
          >
            Get in Touch
          </button>
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-brand-green dark:text-brand-cream hover:bg-brand-cream/40 dark:hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-950 shadow-2xl p-6 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-heading font-bold text-brand-green dark:text-brand-cream">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => handleNav(l.href)}
                      className="w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-brand-cream/40 dark:hover:bg-white/5 hover:text-brand-green dark:hover:text-brand-gold font-medium"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleNav('#contact')} className="btn-primary mt-6 w-full">
                Get in Touch
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
