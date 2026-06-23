import React from 'react';
import { Building2, Hospital, GraduationCap, Factory, ShoppingBag, Landmark } from 'lucide-react';

const industries = [
  { icon: Building2, label: 'Corporate' },
  { icon: Hospital, label: 'Healthcare' },
  { icon: GraduationCap, label: 'Education' },
  { icon: Factory, label: 'Manufacturing' },
  { icon: ShoppingBag, label: 'Retail' },
  { icon: Landmark, label: 'Government' },
];

const IndustriesStrip = () => {
  return (
    <section className="w-full py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-3">
            Industries We Serve
          </h2>
          <p className="text-buckeye-gray max-w-2xl mx-auto">
            Trusted network infrastructure for organizations across Ohio.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {industries.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center p-5 bg-white rounded-lg border border-gray-100 hover:border-buckeye-scarlet/40 hover:shadow-md transition-all"
            >
              <Icon className="w-9 h-9 text-buckeye-scarlet mb-2" aria-hidden="true" />
              <span className="text-sm font-medium text-buckeye-black text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesStrip;
