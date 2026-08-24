import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Products from '@/sections/Products';
import Processing from '@/sections/Processing';
import Quality from '@/sections/Quality';
import Gallery from '@/sections/Gallery';
import WhyChooseUs from '@/sections/WhyChooseUs';
import Testimonials from '@/sections/Testimonials';
import FAQ from '@/sections/FAQ';
import Feedback from '@/sections/Feedback';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import AdminLogin from '@/pages/AdminLogin';
import AdminPasswordReset from '@/pages/AdminPasswordReset';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminDenied from '@/pages/AdminDenied';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsConditions from '@/pages/TermsConditions';
import RefundPolicy from '@/pages/RefundPolicy';

function AdminRoute() {
  const { user, loading, isAdmin, adminChecked } = useAuth();

  if (loading || (user && !adminChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 dark:bg-gray-950">
        <div className="w-8 h-8 border-3 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;
  if (!isAdmin) return <AdminDenied />;
  return <AdminDashboard />;
}

function AppRoutes() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const isAdmin = route.startsWith('#/admin');
  const resetPath = `${import.meta.env.BASE_URL}admin/reset-password`;
  const isPasswordReset = window.location.pathname === resetPath || route.startsWith('#/admin/reset-password');

  if (isAdmin || isPasswordReset) {
    return (
      <AuthProvider>
        {isPasswordReset ? <AdminPasswordReset /> : <AdminRoute />}
      </AuthProvider>
    );
  }

  if (route === '#/privacy-policy') {
    return (
      <ThemeProvider>
        <Navbar />
        <PrivacyPolicy />
        <Footer />
        <WhatsAppButton />
        <BackToTop />
      </ThemeProvider>
    );
  }

  if (route === '#/terms-conditions') {
    return (
      <ThemeProvider>
        <Navbar />
        <TermsConditions />
        <Footer />
        <WhatsAppButton />
        <BackToTop />
      </ThemeProvider>
    );
  }

  if (route === '#/refund-policy') {
    return (
      <ThemeProvider>
        <Navbar />
        <RefundPolicy />
        <Footer />
        <WhatsAppButton />
        <BackToTop />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <Processing />
        <Quality />
        <Gallery />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <Feedback />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </ThemeProvider>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
