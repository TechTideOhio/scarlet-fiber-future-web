
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  
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
    { name: 'Client Testimonials', href: '#testimonials' },
  ];

  const menuItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'Services', 
      href: '/services',
      hasDropdown: true,
      submenu: [
        { name: 'Structured Fiber Cabling', href: '/services#fiber' },
        { name: 'Low-Voltage Installations', href: '/services#low-voltage' },
        { name: 'AI Network Monitoring', href: '/services#ai-monitoring' }
      ]
    },
    { name: 'Our Work', href: '#projects' },
    { name: 'About Us', href: '#why-choose-us' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleMenuClick = (href: string) => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    
    // Handle internal links (sections on current page)
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // For routes like '/services', React Router will handle the navigation
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className="text-buckeye-scarlet font-['Montserrat'] text-xl md:text-2xl font-extrabold">BUCKEYE</span>
              <span className="text-buckeye-scarlet font-['Montserrat'] text-xl md:text-2xl font-light ml-1">DATACOM</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-8">
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
            
            {/* Hamburger button */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-buckeye-gray hover:text-buckeye-scarlet p-2 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hamburger menu overlay */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
        
        {/* Menu content */}
        <div className={`absolute top-0 right-0 h-full bg-buckeye-black text-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full md:w-96 lg:w-80`}>
          <div className="p-6 pt-20">
            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-buckeye-scarlet transition-colors"
            >
              <X size={24} />
            </button>
            
            {/* Menu items */}
            <nav className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <div className="flex items-center justify-between w-full">
                        <Link
                          to={item.href}
                          onClick={() => handleMenuClick(item.href)}
                          className="text-lg font-medium hover:text-buckeye-scarlet transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className="p-2 hover:text-buckeye-scarlet transition-colors"
                        >
                          <ChevronDown 
                            size={20} 
                            className={`transform transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      <div className={`ml-4 space-y-2 overflow-hidden transition-all duration-300 ${
                        isServicesOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        {item.submenu?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => handleMenuClick(subItem.href)}
                            className="block py-2 text-gray-300 hover:text-white transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href.startsWith('#') ? `/${item.href}` : item.href}
                      onClick={() => handleMenuClick(item.href)}
                      className="block py-3 text-lg font-medium hover:text-buckeye-scarlet transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Contact info in menu */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="space-y-2 text-gray-300">
                <p className="text-sm">Call us today:</p>
                <p className="text-lg font-semibold text-white">(614) 679-2486</p>
                <p className="text-sm">info@buckeyedatacom.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
