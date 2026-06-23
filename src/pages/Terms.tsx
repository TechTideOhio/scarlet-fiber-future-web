import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { BreadcrumbSchema } from '../components/StructuredData';

const Terms = () => {
  const updated = 'June 23, 2026';

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Terms of Service"
        description="The terms governing use of the Buckeye DataCom website."
        canonicalUrl="/terms"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Terms of Service', url: '/terms' },
      ]} />

      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-buckeye-black mb-3">Terms of Service</h1>
          <p className="text-sm text-buckeye-gray mb-2">Last updated: {updated}</p>
          <p className="text-sm text-buckeye-gray mb-10 italic">
            This page is maintained by Buckeye DataCom. Please review and adjust the language below with
            qualified counsel before publishing.
          </p>

          <div className="prose prose-lg max-w-none text-buckeye-black">
            <h2>Acceptance of terms</h2>
            <p>
              By accessing or using buckeyedatacom.com (the "Site") you agree to be bound by these Terms of
              Service. If you do not agree, do not use the Site.
            </p>

            <h2>Use of the site</h2>
            <p>
              You agree to use the Site only for lawful purposes and in a manner that does not infringe the
              rights of others or restrict their use of the Site. You may not attempt to gain unauthorized
              access to any portion of the Site or to any systems or networks connected to the Site.
            </p>

            <h2>Intellectual property</h2>
            <p>
              All content on the Site — including text, graphics, logos, and images — is the property of
              Buckeye DataCom or its licensors and is protected by United States and international
              intellectual-property laws. You may not reproduce, distribute, or create derivative works
              without our prior written consent.
            </p>

            <h2>Quotes and proposals</h2>
            <p>
              Pricing, availability, and project scope discussed through this Site or in quote responses are
              subject to a separate written agreement before any work begins. Information on the Site is for
              general informational purposes and does not constitute a binding offer.
            </p>

            <h2>Disclaimer</h2>
            <p>
              The Site is provided "as is" and "as available" without warranties of any kind, express or
              implied. Buckeye DataCom does not warrant that the Site will be uninterrupted, error-free, or
              free of harmful components.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Buckeye DataCom shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the Site.
            </p>

            <h2>Third-party links</h2>
            <p>
              The Site may contain links to third-party websites. We are not responsible for the content,
              policies, or practices of any third-party sites.
            </p>

            <h2>Governing law</h2>
            <p>
              These Terms are governed by the laws of the State of Ohio, without regard to its conflict-of-law
              principles. Any dispute arising out of or related to these Terms shall be resolved in the state
              or federal courts located in Franklin County, Ohio.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              We may revise these Terms at any time. Continued use of the Site after changes constitutes
              acceptance of the revised Terms.
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

export default Terms;
