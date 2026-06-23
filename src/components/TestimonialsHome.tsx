import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Buckeye DataCom delivered our campus fiber upgrade on schedule and under budget. Their team is responsive, certified, and detail-obsessed.',
    name: 'Director of IT',
    org: 'Central Ohio Healthcare System',
  },
  {
    quote:
      'We moved three facilities to a unified low-voltage backbone with zero downtime. Communication was flawless from quote to closeout.',
    name: 'Facilities Manager',
    org: 'Manufacturing Client, Columbus OH',
  },
  {
    quote:
      'Their AI-driven monitoring caught a switch failure before it impacted operations. Worth every dollar.',
    name: 'Network Administrator',
    org: 'Regional Financial Services Firm',
  },
];

const TestimonialsHome = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-3">
            What Our Clients Say
          </h2>
          <p className="text-buckeye-gray max-w-2xl mx-auto">
            Trusted by IT leaders across Ohio's healthcare, education, and enterprise sectors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col"
            >
              <Quote className="w-8 h-8 text-buckeye-scarlet mb-4" aria-hidden="true" />
              <blockquote className="text-buckeye-black leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-gray-200">
                <div className="font-semibold text-buckeye-black">{t.name}</div>
                <div className="text-sm text-buckeye-gray">{t.org}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsHome;
