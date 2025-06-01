
import React from 'react';
import { Building, Target, Heart } from 'lucide-react';

const CompanyStory = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Founded in 2003 in the heart of Ohio, Buckeye DataCom began with a simple mission: 
                to provide reliable, cutting-edge data communications solutions to businesses across 
                the Buckeye State. What started as a small team of passionate technicians has grown 
                into Ohio's premier data communications company.
              </p>
              <p>
                Over the past 20+ years, we've witnessed the digital transformation of businesses 
                across every industry. From the early days of basic network installations to today's 
                sophisticated fiber optic networks and AI-powered monitoring systems, we've been 
                at the forefront of technological advancement.
              </p>
              <p>
                Our deep Ohio roots and commitment to local businesses have been the foundation 
                of our success. We understand the unique challenges facing Ohio businesses and 
                provide solutions that are not just technically superior, but also practical 
                and cost-effective.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80"
              alt="Buckeye DataCom team at work"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-buckeye-black/20 to-transparent rounded-lg" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Building className="w-12 h-12 text-buckeye-scarlet" />
            </div>
            <h3 className="text-xl font-bold text-buckeye-black mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To empower Ohio businesses with reliable, innovative data communication solutions 
              that drive growth and success in the digital age.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Target className="w-12 h-12 text-buckeye-scarlet" />
            </div>
            <h3 className="text-xl font-bold text-buckeye-black mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To be the leading data communications provider in Ohio, setting the standard 
              for technical excellence and customer service.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-buckeye-scarlet" />
            </div>
            <h3 className="text-xl font-bold text-buckeye-black mb-2">Our Promise</h3>
            <p className="text-gray-600">
              To deliver solutions that exceed expectations, backed by unmatched support 
              and a commitment to your business success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
