
import React from 'react';
import { Separator } from "@/components/ui/separator";

const StatsStrip = () => {
  return (
    <section className="bg-buckeye-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-buckeye-scarlet text-3xl md:text-4xl font-bold">99.99%</p>
            <p className="text-white text-sm mt-2">Uptime Guaranteed</p>
          </div>
          
          <Separator orientation="vertical" className="hidden md:block h-16 bg-gray-700" />
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-buckeye-scarlet text-3xl md:text-4xl font-bold">30-Sec</p>
            <p className="text-white text-sm mt-2">Online Quotes</p>
          </div>
          
          <Separator orientation="vertical" className="hidden md:block h-16 bg-gray-700" />
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-buckeye-scarlet text-3xl md:text-4xl font-bold">20+</p>
            <p className="text-white text-sm mt-2">Years Ohio-Built Reliability</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
