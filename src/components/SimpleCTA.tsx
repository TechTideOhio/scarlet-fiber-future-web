
import React from 'react';
import CTAButton from './CTAButton';

const SimpleCTA = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-buckeye-black mb-6">
          Ready to transform your network?
        </h2>
        <button className="bg-buckeye-scarlet hover:bg-[#990000] text-white font-bold py-4 px-8 rounded-md transition-all duration-300 hover:shadow-lg">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default SimpleCTA;
