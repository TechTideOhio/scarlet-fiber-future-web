import React from 'react';

const stats = [
  { value: '99.99%', label: 'Uptime guaranteed' },
  { value: '24-hr', label: 'Quote response' },
  { value: '20+', label: 'Years Ohio-built reliability' },
];

const StatsStrip = () => {
  return (
    <section className="bg-buckeye-black py-16 md:py-20 border-y border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0"
            >
              <p className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-none mb-3">
                <span className="text-buckeye-scarlet">{s.value.charAt(0)}</span>{s.value.slice(1)}
              </p>
              <p className="text-white/80 text-xs uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
