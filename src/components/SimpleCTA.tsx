
import React from 'react';
import CTAButton from './CTAButton';

const SimpleCTA = () => {
  return (
    <section className="py-20 bg-buckeye-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to transform your network?
        </h2>
        <CTAButton variant="primary" size="lg">
          Get Started
        </CTAButton>
      </div>
    </section>
  );
};

export default SimpleCTA;
