import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import CTAButton from './CTAButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Why Us', href: '#why-choose-us' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center">
            <span className="text-buckeye-scarlet font-['Montserrat'] text-xl md:text-2xl font-extrabold">BUCKEYE</span>
            <span className="text-buckeye-scarlet font-['Montserrat'] text-xl md:text-2xl font-light ml-1">DATACOM</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden lg:flex space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-buckeye-gray hover:text-buckeye-scarlet font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <CTAButton variant="primary" size="md">
              Get a Quote
            </CTAButton>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-buckeye-gray p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 py-4">
          <div className="flex flex-col space-y-4 px-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-buckeye-gray hover:text-buckeye-scarlet py-2 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <CTAButton variant="primary" size="md" className="mt-4">
              Get a Quote
            </CTAButton>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
