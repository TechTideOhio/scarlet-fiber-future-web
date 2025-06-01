
import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="bg-buckeye-gray py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="text-buckeye-black">
              <h3 className="font-bold text-base mb-2">Contact Us</h3>
              <ul className="space-y-1 text-sm">
                <li>6057 Sweetleaf Ct, Galloway, OH 43119</li>
                <li>(614) 679-2486 | info@buckeyedatacom.com</li>
              </ul>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center justify-start md:justify-end space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 transition-colors"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sub-footer */}
      <div className="bg-buckeye-black py-2">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-white text-xs text-center">
            © {new Date().getFullYear()} Buckeye DataCom. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
