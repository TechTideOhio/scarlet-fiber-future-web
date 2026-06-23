import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full" role="contentinfo" aria-label="Site footer">
      <div className="bg-buckeye-black py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="text-white">
              <div className="flex items-center mb-4">
                <span className="font-['Montserrat'] text-xl font-extrabold text-buckeye-scarlet">BUCKEYE</span>
                <span className="font-['Montserrat'] text-xl font-light ml-1 text-buckeye-scarlet">DATACOM</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Ohio's trusted partner for enterprise fiber, low-voltage, and AI-driven network infrastructure.
              </p>
              <address className="space-y-1 text-gray-300 not-italic text-sm">
                <p>6057 Sweetleaf Ct</p>
                <p>Galloway, OH 43119</p>
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

            {/* Services */}
            <div className="text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-buckeye-scarlet mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services#fiber" className="text-gray-300 hover:text-white transition-colors">Structured Fiber Cabling</Link></li>
                <li><Link to="/services#low-voltage" className="text-gray-300 hover:text-white transition-colors">Low-Voltage Installations</Link></li>
                <li><Link to="/services#ai-monitoring" className="text-gray-300 hover:text-white transition-colors">AI Network Monitoring</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">All Services</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-buckeye-scarlet mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/our-work" className="text-gray-300 hover:text-white transition-colors">Our Work</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Client Login</Link></li>
              </ul>
            </div>

            {/* Legal + CTA */}
            <div className="text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-buckeye-scarlet mb-4">Legal</h3>
              <ul className="space-y-2 text-sm mb-6">
                <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle size={16} className="text-buckeye-scarlet" aria-hidden="true" />
                <span className="text-gray-300">Quotes returned within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-buckeye-black border-t border-gray-800 py-4">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-sm">
            © {year} Buckeye DataCom. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-xs">Serving Central Ohio & surrounding regions</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
