import React from 'react';

const testimonials = [
  {
    quote:
      'Delivered our campus fiber upgrade on schedule and under budget. Responsive, certified, detail-obsessed.',
    name: 'Director of IT',
    org: 'Central Ohio Healthcare System',
  },
  {
    quote:
      'We moved three facilities to a unified low-voltage backbone with zero downtime. Communication was flawless.',
    name: 'Facilities Manager',
    org: 'Manufacturing client, Columbus OH',
  },
  {
    quote:
      'AI monitoring caught a switch failure before it impacted operations. Worth every dollar.',
    name: 'Network Administrator',
    org: 'Regional financial services firm',
  },
];

const TestimonialsHome = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-gray-50" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-buckeye-scarlet font-medium mb-4">
            02 / Field reports
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-buckeye-black leading-[1.05]"
          >
            Trusted by Ohio's <em className="italic font-normal text-buckeye-scarlet">IT leaders</em>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-white p-8 md:p-10 flex flex-col gap-6"
            >
              <span aria-hidden className="font-display text-6xl leading-none text-buckeye-scarlet/80">
                &ldquo;
              </span>
              <blockquote className="font-display text-xl md:text-[1.4rem] leading-snug text-buckeye-black flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="pt-5 border-t border-gray-200">
                <div className="text-sm font-semibold text-buckeye-black">{t.name}</div>
                <div className="text-xs uppercase tracking-wider text-buckeye-gray mt-1">{t.org}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsHome;
