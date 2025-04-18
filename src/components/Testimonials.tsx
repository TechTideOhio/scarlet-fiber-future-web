
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Jennifer Reynolds',
      position: 'CTO, Columbus Tech Industries',
      quote: 'Buckeye DataCom delivered a fiber solution that increased our network performance by 300% while reducing our overall connectivity costs.',
      stars: 5
    },
    {
      name: 'Michael Thompson',
      position: 'IT Director, Ohio Healthcare Systems',
      quote: 'The reliability of Buckeye DataCom\'s network has been crucial for our hospital operations. Their 24/7 support team is responsive and knowledgeable.',
      stars: 5
    },
    {
      name: 'David Wilson',
      position: 'Operations Manager, Midwest Manufacturing',
      quote: 'After switching to Buckeye DataCom, network downtime is a thing of the past. Their team designed a solution perfectly tailored to our needs.',
      stars: 5
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center">What Our Clients Say</h2>
        <p className="section-subtitle text-center">
          Don't just take our word for it - hear from businesses that trust Buckeye DataCom
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} size={20} fill="#BB0000" color="#BB0000" />
                ))}
              </div>
              <p className="text-buckeye-gray italic mb-6">
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <p className="font-bold text-buckeye-black">{testimonial.name}</p>
                <p className="text-sm text-buckeye-gray">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-buckeye-gray font-medium">
            Join hundreds of satisfied businesses across Ohio who trust Buckeye DataCom
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
