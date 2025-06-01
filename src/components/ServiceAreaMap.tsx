
import React from 'react';
import { MapPin, Clock, Truck } from 'lucide-react';

const ServiceAreaMap = () => {
  const serviceCities = [
    'Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton',
    'Youngstown', 'Canton', 'Lorain', 'Hamilton', 'Springfield', 'Kettering',
    'Elyria', 'Lakewood', 'Cuyahoga Falls', 'Middletown', 'Newark', 'Mansfield',
    'Mentor', 'Beavercreek', 'Strongsville', 'Dublin', 'Fairfield', 'Findlay'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-4">
            Serving All of Ohio
          </h2>
          <p className="text-xl text-buckeye-gray max-w-3xl mx-auto">
            From Cleveland to Cincinnati, Toledo to Columbus – we provide comprehensive 
            data communications services across the entire Buckeye State.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&w=800&q=80"
              alt="Ohio State outline with service coverage"
              className="w-full rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-buckeye-black/30 to-transparent rounded-lg" />
            <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg">
              <div className="flex items-center text-buckeye-black">
                <MapPin className="w-5 h-5 text-buckeye-scarlet mr-2" />
                <span className="font-medium">Statewide Coverage</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-buckeye-black mb-6">
              Complete Ohio Coverage
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-gray-50 p-4 rounded-lg">
                <Clock className="w-8 h-8 text-buckeye-scarlet mx-auto mb-2" />
                <div className="text-2xl font-bold text-buckeye-black">2 Hours</div>
                <div className="text-sm text-gray-600">Average Response Time</div>
              </div>
              
              <div className="text-center bg-gray-50 p-4 rounded-lg">
                <Truck className="w-8 h-8 text-buckeye-scarlet mx-auto mb-2" />
                <div className="text-2xl font-bold text-buckeye-black">24/7</div>
                <div className="text-sm text-gray-600">Emergency Service</div>
              </div>
              
              <div className="text-center bg-gray-50 p-4 rounded-lg">
                <MapPin className="w-8 h-8 text-buckeye-scarlet mx-auto mb-2" />
                <div className="text-2xl font-bold text-buckeye-black">88</div>
                <div className="text-sm text-gray-600">Counties Served</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-buckeye-black mb-4">
                Major Service Cities Include:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                {serviceCities.map((city, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-buckeye-scarlet rounded-full mr-2" />
                    {city}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-buckeye-gray rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Don't see your city listed?</strong> We serve communities throughout Ohio. 
                Contact us to confirm service availability in your area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;
