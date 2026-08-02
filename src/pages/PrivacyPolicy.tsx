import { ArrowLeft } from 'lucide-react';
import { company } from '@/data/site';
import BrandLogo from '@/components/BrandLogo';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-brand-cream/30 dark:bg-gray-950 pt-28 pb-20">
      <div className="container-px max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <BrandLogo size={56} />
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-green dark:text-brand-cream">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: August 2026</p>
          </div>
        </div>

        <a href="#home" className="inline-flex items-center gap-1.5 text-sm text-brand-green dark:text-brand-gold font-medium hover:underline mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </a>

        <div className="prose-legal">
          <p>
            {company.name} ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or contact us for business enquiries.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information that you voluntarily provide when you:</p>
          <ul>
            <li><strong>Enquiry forms:</strong> Your name, phone number, email address, and message.</li>
            <li><strong>Feedback forms:</strong> Your name, email, rating, and comments.</li>
            <li><strong>Direct communication:</strong> Information shared via phone, WhatsApp, or email.</li>
          </ul>
          <p>We do not collect sensitive personal data such as Aadhaar, PAN, or financial account numbers through this website.</p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To respond to your business enquiries and service requests.</li>
            <li>To share product information, quotations, and order updates.</li>
            <li>To improve our products, services, and website content.</li>
            <li>To send occasional business communications (only if you have consented).</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. We may share information with trusted service providers (e.g., logistics partners) strictly for fulfilling your orders, or when required by law.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Our website may use essential cookies to function properly. We do not use cookies for targeted advertising.
          </p>

          <h2>6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information by contacting us at <a href={`mailto:${company.email}`}>{company.email}</a>.</p>

          <h2>7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites (e.g., social media). We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our website and services are intended for businesses and adults. We do not knowingly collect information from children under 18.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            For any questions about this Privacy Policy, please contact us:
          </p>
          <ul>
            <li>Email: <a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li>Phone: <a href={`tel:${company.phone.replace(/\s/g, '')}`}>{company.phone}</a></li>
            <li>Address: {company.factory.line1}, {company.factory.line2}, {company.factory.line3}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
