import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { BreadcrumbSchema } from '../components/StructuredData';

const Privacy = () => {
  const updated = 'June 23, 2026';

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy"
        description="How Buckeye DataCom collects, uses, and protects information submitted through this website."
        canonicalUrl="/privacy"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Privacy Policy', url: '/privacy' },
      ]} />

      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-buckeye-black mb-3">Privacy Policy</h1>
          <p className="text-sm text-buckeye-gray mb-2">Last updated: {updated}</p>
          <p className="text-sm text-buckeye-gray mb-10 italic">
            This page is maintained by Buckeye DataCom. Please review and adjust the language below to match
            your actual data-handling practices before publishing.
          </p>

          <div className="prose prose-lg max-w-none text-buckeye-black">
            <h2>Overview</h2>
            <p>
              Buckeye DataCom ("we", "us", "our") respects your privacy. This policy explains what we collect
              when you visit buckeyedatacom.com or submit one of our forms, how we use that information, and
              the choices you have.
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li><strong>Contact &amp; quote form data:</strong> name, business email, phone number, company, and the message or project details you submit.</li>
              <li><strong>Usage data:</strong> standard server and analytics data such as pages viewed, referring URL, browser type, and approximate location derived from IP.</li>
              <li><strong>Cookies:</strong> functional cookies required to operate the site, and optional analytics cookies to understand usage trends.</li>
            </ul>

            <h2>How we use information</h2>
            <ul>
              <li>To respond to quote requests and contact inquiries.</li>
              <li>To deliver, maintain, and improve our services.</li>
              <li>To send transactional communications related to your inquiry.</li>
              <li>To comply with legal obligations.</li>
            </ul>

            <h2>How we store and protect information</h2>
            <p>
              Form submissions are stored in our managed cloud database with row-level access controls and
              transmitted over TLS. Email notifications to our team are sent through a transactional email
              service. We retain inquiry data only as long as needed to respond to your request and meet our
              business and legal obligations.
            </p>

            <h2>Sharing</h2>
            <p>
              We do not sell your personal information. We share data only with service providers who help us
              operate this site (hosting, email delivery, analytics) under appropriate confidentiality
              obligations, or when required by law.
            </p>

            <h2>Your choices</h2>
            <p>
              You may request access, correction, or deletion of personal information you have submitted by
              contacting us at{' '}
              <a className="text-buckeye-scarlet" href="mailto:info@buckeyedatacom.com">
                info@buckeyedatacom.com
              </a>
              .
            </p>

            <h2>Children's privacy</h2>
            <p>This site is intended for business users and is not directed to children under 13.</p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The "last updated" date above reflects the most
              recent revision.
            </p>

            <h2>Contact</h2>
            <p>
              Buckeye DataCom<br />
              6057 Sweetleaf Ct, Galloway, OH 43119<br />
              <a className="text-buckeye-scarlet" href="mailto:info@buckeyedatacom.com">info@buckeyedatacom.com</a><br />
              <a className="text-buckeye-scarlet" href="tel:+16146792486">(614) 679-2486</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
