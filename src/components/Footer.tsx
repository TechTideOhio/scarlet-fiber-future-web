
import React from 'react';
import { CheckCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Main Footer */}
      <div className="bg-black py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Section - Company Information */}
            <div className="text-white">
              <h3 className="text-xl font-bold text-white mb-4">Buckeye DataCom</h3>
              <div className="space-y-2 text-gray-300">
                <p>6057 Sweetleaf Ct, Galloway, OH 43119</p>
                <p>(614) 679-2486</p>
                <p>info@buckeyedatacom.com</p>
              </div>
            </div>
            
            {/* Right Section - Quick Quote Information */}
            <div className="flex items-start justify-start md:justify-end">
              <div className="text-white">
                <h4 className="text-lg font-semibold mb-3 text-buckeye-scarlet">Get Your Quote Fast</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-buckeye-scarlet" />
                    <span className="text-gray-300">Quotes Returned Within 24 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
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
