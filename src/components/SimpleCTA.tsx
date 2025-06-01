
import React from 'react';
import CTAButton from './CTAButton';

const SimpleCTA = () => {
  return (
    <section className="w-full bg-buckeye-black">
      <div className="container mx-auto px-4 text-center py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
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
