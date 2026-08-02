import { ArrowLeft } from 'lucide-react';
import { company } from '@/data/site';
import BrandLogo from '@/components/BrandLogo';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-brand-cream/30 dark:bg-gray-950 pt-28 pb-20">
      <div className="container-px max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <BrandLogo size={56} />
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-green dark:text-brand-cream">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: August 2026</p>
          </div>
        </div>

        <a href="#home" className="inline-flex items-center gap-1.5 text-sm text-brand-green dark:text-brand-gold font-medium hover:underline mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </a>

        <div className="prose-legal">
          <p>
            These Terms &amp; Conditions ("Terms") govern your use of the website and services of {company.name} ("we", "us", or "our"). By accessing our website or contacting us, you agree to these Terms.
          </p>

          <h2>1. Use of Our Website</h2>
          <ul>
            <li>You agree to use this website for lawful business purposes only.</li>
            <li>You must not attempt to disrupt, damage, or gain unauthorized access to any part of the website.</li>
            <li>All content on this website (text, images, logos) is the property of {company.name} and may not be reproduced without permission.</li>
          </ul>

          <h2>2. Products &amp; Orders</h2>
          <ul>
            <li>All product descriptions, grades, and images are provided for general information. Actual products may vary slightly in size, color, and appearance.</li>
            <li>Orders are confirmed only after mutual agreement on quantity, grade, price, and delivery terms.</li>
            <li>We reserve the right to refuse or cancel any order at our discretion, with a full refund of any advance paid.</li>
          </ul>

          <h2>3. Pricing</h2>
          <p>
            Prices for cashew products are quoted based on grade, quantity, and prevailing market rates. Prices are subject to change without notice. A confirmed quotation remains valid for the period stated in the quotation.
          </p>

          <h2>4. Payment Terms</h2>
          <ul>
            <li>Payment terms (advance, partial, or full) are agreed upon at the time of order confirmation.</li>
            <li>Orders are dispatched after receipt of agreed payment.</li>
            <li>For new business relationships, an advance payment may be required.</li>
          </ul>

          <h2>5. Delivery</h2>
          <ul>
            <li>We strive to deliver within the agreed timeline. Delivery dates are estimates and not guaranteed.</li>
            <li>Delivery charges, if applicable, are communicated at the time of order confirmation.</li>
            <li>Risk in the goods passes to the buyer upon dispatch from our facility.</li>
          </ul>

          <h2>6. Quality &amp; Inspection</h2>
          <p>
            Our products undergo multi-stage quality inspection before dispatch. Buyers are encouraged to inspect goods upon receipt and report any concerns within 48 hours of delivery.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {company.name} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability is limited to the value of the products supplied.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            The {company.shortName} name, logo, and all website content are intellectual property of {company.name}. Unauthorized use is prohibited.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Dhule, Maharashtra.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We may update these Terms at any time. The updated version will be posted on this page with a revised date.
          </p>

          <h2>11. Contact Us</h2>
          <p>For any questions about these Terms, please contact us:</p>
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
