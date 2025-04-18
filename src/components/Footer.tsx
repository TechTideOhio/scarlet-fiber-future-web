
import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-buckeye-black text-white">
      <div className="container mx-auto py-12 px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-8 md:mb-0">
            <a href="#" className="flex items-center mb-4">
              <span className="text-buckeye-scarlet font-['Montserrat'] text-xl font-extrabold">BUCKEYE</span>
              <span className="text-white font-['Montserrat'] text-xl font-light ml-1">DATACOM</span>
            </a>
            <p className="text-gray-400 mb-6">
              Connecting Ohio businesses with rock-solid fiber solutions since 2001.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Enterprise Fiber</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Wireless Solutions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Structured Cabling</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Network Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Data Center Services</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Our Work</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-buckeye-scarlet transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Columbus, Ohio</li>
              <li className="text-gray-400">(614) 555-0123</li>
              <li className="text-gray-400">info@buckeyedatacom.com</li>
            </ul>
          </div>
        </div>
        
        <hr className="my-8 border-gray-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Buckeye DataCom. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-buckeye-scarlet text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-buckeye-scarlet text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-buckeye-scarlet text-sm transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
