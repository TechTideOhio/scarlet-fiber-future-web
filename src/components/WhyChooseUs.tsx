import React from 'react';
import { Award, Clock, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const advantages = [
  {
    icon: Award,
    title: 'Industry Leadership',
    desc: 'BICSI-certified team with 20+ years installing structured cable across Ohio.',
  },
  {
    icon: Zap,
    title: 'Unmatched Performance',
    desc: 'OM4/OM5 fiber, Cat6A copper, tested to TIA standards on every run.',
  },
  {
    icon: Shield,
    title: 'Rock-Solid Security',
    desc: 'Physically secure cabinets, documented pathways, full chain of custody.',
  },
  {
    icon: Clock,
    title: 'Local Support',
    desc: 'Galloway-based crews on-site within 24 hours for break/fix calls.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-white" aria-labelledby="why-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.2em] text-buckeye-scarlet font-medium mb-4">
              03 / Why Buckeye
            </p>
            <h2
              id="why-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-buckeye-black leading-[1.05] mb-6"
            >
              The standard <em className="italic font-normal text-buckeye-scarlet">behind the wall</em>.
            </h2>
            <p className="text-buckeye-gray text-lg leading-relaxed mb-8">
              We do one thing: build the physical network your software depends on. Done right the first time, documented for the next 20 years.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-buckeye-scarlet font-medium border-b border-buckeye-scarlet/40 hover:border-buckeye-scarlet pb-1 transition-colors"
            >
              About our team
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
            {advantages.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-7 md:p-8">
                <Icon className="w-7 h-7 text-buckeye-scarlet mb-5" aria-hidden="true" />
                <h3 className="font-display text-xl text-buckeye-black mb-2">{title}</h3>
                <p className="text-sm text-buckeye-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
