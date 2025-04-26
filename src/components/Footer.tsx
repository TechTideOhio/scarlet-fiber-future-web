
import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer>
      <div className="bg-buckeye-gray py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="text-buckeye-black">
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li>6057 Sweetleaf Ct</li>
                <li>Galloway, OH 43119</li>
                <li>United States</li>
                <li className="mt-4">(614) 555-0123</li>
                <li>info@buckeyedatacom.com</li>
              </ul>
            </div>
            
            {/* Social Links */}
            <div className="flex items-start justify-start md:justify-end space-x-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 transition-colors"
              >
                <Linkedin size={32} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 transition-colors"
              >
                <Github size={32} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sub-footer */}
      <div className="bg-buckeye-black py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-white text-sm text-center">
            © {new Date().getFullYear()} Buckeye DataCom. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
