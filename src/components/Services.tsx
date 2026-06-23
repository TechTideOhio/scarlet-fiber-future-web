import React from 'react';
import { Link } from 'react-router-dom';
import { Cable, Wrench, Network } from 'lucide-react';

const services = [
  {
    num: '01',
    icon: Cable,
    title: 'Structured Fiber Cabling',
    description:
      'Enterprise OM4/OM5 single-mode and multi-mode backbone, fully tested and certified.',
    link: '/services#fiber',
  },
  {
    num: '02',
    icon: Wrench,
    title: 'Low-Voltage Installations',
    description:
      'Voice, data, access control, paging, and AV — installed clean and documented to code.',
    link: '/services#low-voltage',
  },
  {
    num: '03',
    icon: Network,
    title: 'AI Network Monitoring',
    description:
      'Continuous surveillance with anomaly detection. Catch issues before they reach users.',
    link: '/services#ai-monitoring',
  },
];

const Services = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-gray-50" aria-labelledby="services-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-buckeye-scarlet font-medium mb-4">
              What we do
            </p>
            <h2
              id="services-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-buckeye-black leading-[1.05]"
            >
              Three services. <em className="italic font-normal text-buckeye-scarlet">One discipline</em>.
            </h2>
          </div>
          <Link
            to="/services"
            className="text-buckeye-scarlet font-medium border-b border-buckeye-scarlet/40 hover:border-buckeye-scarlet pb-1 self-start md:self-end"
          >
            All services →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
          {services.map(({ num, icon: Icon, title, description, link }) => (
            <Link
              key={title}
              to={link}
              className="group bg-white p-8 md:p-10 flex flex-col transition-colors hover:bg-buckeye-black hover:text-white"
            >
              <div className="flex items-start justify-between mb-10">
                <Icon className="w-8 h-8 text-buckeye-scarlet" aria-hidden="true" />
                <span className="font-display text-sm text-buckeye-gray group-hover:text-white/50">{num}</span>
              </div>
              <h3 className="font-display text-2xl md:text-[1.7rem] leading-tight text-buckeye-black group-hover:text-white mb-3">
                {title}
              </h3>
              <p className="text-sm text-buckeye-gray group-hover:text-white/75 leading-relaxed flex-1">
                {description}
              </p>
              <span className="mt-8 text-sm text-buckeye-scarlet group-hover:text-white font-medium">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
