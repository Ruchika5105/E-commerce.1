import { ArrowLeft } from 'lucide-react';
import { company } from '@/data/site';
import BrandLogo from '@/components/BrandLogo';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-brand-cream/30 dark:bg-gray-950 pt-28 pb-20">
      <div className="container-px max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <BrandLogo size={56} />
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-green dark:text-brand-cream">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: August 2026</p>
          </div>
        </div>

        <a href="#home" className="inline-flex items-center gap-1.5 text-sm text-brand-green dark:text-brand-gold font-medium hover:underline mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </a>

        <div className="prose-legal">
          <p>
            This policy outlines the terms for cancellations, refunds, and returns for orders placed with {company.name}.
          </p>

          <h2>1. Order Cancellation</h2>
          <ul>
            <li><strong>Before dispatch:</strong> Orders may be cancelled before dispatch with a full refund of any advance payment.</li>
            <li><strong>After dispatch:</strong> Orders that have already been dispatched cannot be cancelled. Please refer to the Returns section for damaged or defective goods.</li>
          </ul>

          <h2>2. Refund Eligibility</h2>
          <p>Refunds are issued in the following situations:</p>
          <ul>
            <li>The order is cancelled by us due to stock unavailability or other reasons.</li>
            <li>Products are received damaged, defective, or not as per the agreed grade.</li>
            <li>An advance payment was made and the order is cancelled before dispatch.</li>
          </ul>

          <h2>3. Reporting Damaged or Defective Goods</h2>
          <ul>
            <li>Buyers must inspect goods upon receipt and report any damage or defect within 48 hours of delivery.</li>
            <li>Reports must include photographic evidence sent to <a href={`mailto:${company.email}`}>{company.email}</a> along with order details.</li>
            <li>Claims made after 48 hours will not be eligible for refund or replacement.</li>
          </ul>

          <h2>4. Refund Process</h2>
          <ul>
            <li>Approved refunds are processed within 7–10 business days.</li>
            <li>Refunds are issued to the original payment method or via bank transfer, as mutually agreed.</li>
            <li>Shipping or logistics charges, where applicable, are non-refundable unless the issue is on our end.</li>
          </ul>

          <h2>5. Returns</h2>
          <p>
            As our products are food items, returns are accepted only for damaged or defective goods reported within 48 hours. Returns are not accepted for products that have been opened, used, or stored improperly after delivery.
          </p>

          <h2>6. Non-Refundable Cases</h2>
          <ul>
            <li>Orders cancelled after dispatch.</li>
            <li>Products reported damaged after 48 hours of delivery.</li>
            <li>Products that have been opened or improperly stored.</li>
            <li>Disputes based on subjective taste preferences.</li>
          </ul>

          <h2>7. Contact Us</h2>
          <p>For refund or cancellation queries, please contact us:</p>
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
