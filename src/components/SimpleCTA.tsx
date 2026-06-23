import React from 'react';
import { Link } from 'react-router-dom';

const SimpleCTA = () => {
  return (
    <section className="w-full bg-white py-16" aria-labelledby="simple-cta-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 id="simple-cta-heading" className="text-2xl md:text-3xl font-bold text-buckeye-black mb-6">
          Ready to transform your network?
        </h2>
        <Link
          to="/contact"
          className="inline-block bg-buckeye-scarlet hover:bg-[#990000] text-white font-bold py-4 px-8 rounded-md transition-all duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buckeye-scarlet focus-visible:ring-offset-2"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default SimpleCTA;
