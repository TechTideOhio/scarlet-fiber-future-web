
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { trackNavClick, trackMobileMenuToggle, trackSubmenuClick } from '@/lib/analytics';

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

  // Body scroll lock effect
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
    { name: 'Our Work', href: '/our-work' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleMenuClick = (href: string, itemName: string) => {
    // Track navigation click
    trackNavClick(itemName, location.pathname);
    
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

  const handleSubmenuClick = (parentName: string, subItemName: string, href: string) => {
    // Track submenu click
    trackSubmenuClick(parentName, subItemName);
    handleMenuClick(href, subItemName);
  };

  const handleMobileMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    trackMobileMenuToggle(newState ? 'open' : 'close');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className="font-['Montserrat'] text-xl md:text-2xl font-extrabold text-buckeye-scarlet">BUCKEYE</span>
              <span className="font-['Montserrat'] text-xl md:text-2xl font-light ml-1 text-buckeye-scarlet">DATACOM</span>
            </Link>
            
            {/* Hamburger button */}
            <div className="flex items-center">
              <button 
                onClick={handleMobileMenuToggle}
                className={`p-2 transition-colors ${isScrolled ? 'text-buckeye-gray hover:text-buckeye-scarlet' : 'text-white hover:text-gray-200'}`}
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
      
      {/* Full-screen overlay with smooth animations */}
      <div className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Dark backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-50' : 'opacity-0'
          }`} 
          onClick={() => setIsMenuOpen(false)} 
        />
        
        {/* Mobile menu content - full screen */}
        <div className={`absolute inset-0 bg-buckeye-black text-white transform transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className="h-full flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 pt-20 border-b border-gray-700">
              <div className="flex items-center">
                <span className="text-buckeye-scarlet font-['Montserrat'] text-xl font-extrabold">BUCKEYE</span>
                <span className="text-buckeye-scarlet font-['Montserrat'] text-xl font-light ml-1">DATACOM</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-buckeye-scarlet transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>
            
            {/* Menu items - touch-friendly sizing */}
            <nav className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <Link
                            to={item.href}
                            onClick={() => handleMenuClick(item.href, item.name)}
                            className={`flex-1 py-4 px-2 text-xl font-medium transition-colors min-h-[48px] flex items-center ${
                              isActiveRoute(item.href) 
                                ? 'text-buckeye-scarlet border-l-4 border-buckeye-scarlet pl-4' 
                                : 'text-white hover:text-buckeye-scarlet'
                            }`}
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                            className="p-4 hover:text-buckeye-scarlet transition-colors min-h-[48px] flex items-center"
                          >
                            <ChevronDown 
                              size={24} 
                              className={`transform transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </div>
                        
                        {/* Submenu with smooth animation and indentation */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isServicesOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="pl-8 space-y-1 border-l-2 border-gray-600 ml-2">
                            {item.submenu?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                onClick={() => handleSubmenuClick(item.name, subItem.name, subItem.href)}
                                className={`block py-3 px-4 text-lg transition-colors min-h-[48px] flex items-center ${
                                  isActiveRoute(subItem.href)
                                    ? 'text-buckeye-scarlet bg-buckeye-scarlet/10'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => handleMenuClick(item.href, item.name)}
                        className={`block py-4 px-2 text-xl font-medium transition-colors min-h-[48px] flex items-center ${
                          isActiveRoute(item.href)
                            ? 'text-buckeye-scarlet border-l-4 border-buckeye-scarlet pl-4'
                            : 'text-white hover:text-buckeye-scarlet'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>
            
            {/* Footer contact info */}
            <div className="px-6 py-8 border-t border-gray-700 bg-gray-900/50">
              <div className="space-y-3">
                <p className="text-gray-400 text-sm font-medium">Get in touch</p>
                <div className="space-y-2">
                  <p className="text-white text-lg font-semibold">(614) 679-2486</p>
                  <p className="text-gray-300">info@buckeyedatacom.com</p>
                  <p className="text-gray-400 text-sm">6057 Sweetleaf Ct, Galloway, OH 43119</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
