import React from 'react';
import { CheckCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full" role="contentinfo" aria-label="Site footer">
      <div className="bg-black py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="text-white">
              <h3 className="text-xl font-bold text-white mb-4">Buckeye DataCom</h3>
              <address className="space-y-2 text-gray-300 not-italic">
                <p>6057 Sweetleaf Ct, Galloway, OH 43119</p>
                <p>
                  <a href="tel:+16146792486" className="hover:text-buckeye-scarlet transition-colors">
                    (614) 679-2486
                  </a>
                </p>
                <p>
                  <a href="mailto:info@buckeyedatacom.com" className="hover:text-buckeye-scarlet transition-colors">
                    info@buckeyedatacom.com
                  </a>
                </p>
              </address>
            </div>
            
            <div className="flex items-start justify-start md:justify-end">
              <div className="text-white">
                <h4 className="text-lg font-semibold mb-3 text-buckeye-scarlet">Get Your Quote Fast</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-buckeye-scarlet" aria-hidden="true" />
                    <span className="text-gray-300">Quotes Returned Within 24 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black border-t border-gray-800 py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Buckeye DataCom. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
