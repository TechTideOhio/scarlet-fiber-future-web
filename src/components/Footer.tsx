import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full" role="contentinfo" aria-label="Site footer">
      <div className="bg-buckeye-black py-8 md:py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {/* Brand */}
            <div className="text-white">
              <div className="flex items-baseline mb-4">
                <span className="font-display text-2xl font-semibold text-buckeye-scarlet tracking-tight">Buckeye</span>
                <span className="font-display text-2xl font-normal italic ml-2 text-white/70">DataCom</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Ohio's trusted partner for enterprise fiber, low-voltage, and AI-driven network infrastructure.
              </p>
              <address className="space-y-1 text-gray-300 not-italic text-sm">
                <p>6057 Sweetleaf Ct</p>
                <p>Galloway, OH 43119</p>
                <p>
                  <a href="tel:+16146792486" className="inline-flex min-h-11 items-center hover:text-buckeye-scarlet active:text-buckeye-scarlet transition-colors duration-150 link-underline">
                    (614) 679-2486
                  </a>
                </p>
                <p>
                  <a href="mailto:info@buckeyedatacom.com" className="inline-flex min-h-11 items-center hover:text-buckeye-scarlet active:text-buckeye-scarlet transition-colors duration-150 link-underline">
                    info@buckeyedatacom.com
                  </a>
                </p>
              </address>
            </div>

            {/* Services */}
            <div className="text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-buckeye-scarlet pl-2">Services</h3>
              <ul className="text-sm">
                <li><Link to="/services#fiber" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">Structured Fiber Cabling</Link></li>
                <li><Link to="/services#low-voltage" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">Low-Voltage Installations</Link></li>
                <li><Link to="/services#ai-monitoring" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">AI Network Monitoring</Link></li>
                <li><Link to="/services" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">All Services</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-buckeye-scarlet pl-2">Company</h3>
              <ul className="text-sm">
                <li><Link to="/about" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">About Us</Link></li>
                <li><Link to="/our-work" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">Our Work</Link></li>
                <li><Link to="/contact" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">Contact</Link></li>
                <li><Link to="/login" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">Client Login</Link></li>
              </ul>
            </div>

            {/* Legal + CTA */}
            <div className="text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-buckeye-scarlet pl-2">Legal</h3>
              <ul className="text-sm mb-4">
                <li><Link to="/privacy" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">Privacy Policy</Link></li>
                <li><Link to="/terms" className="inline-flex min-h-11 items-center text-gray-300 hover:text-white active:text-white transition-colors duration-150 link-underline">Terms of Service</Link></li>
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
          <p className="text-gray-300 text-xs">Serving Central Ohio & surrounding regions</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
