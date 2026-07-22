import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { trackNavClick, trackMobileMenuToggle, trackSubmenuClick } from '@/lib/analytics';

type MenuItem = {
  name: string;
  href: string;
  hasDropdown?: boolean;
  submenu?: { name: string; href: string }[];
};

const menuItems: MenuItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Services',
    href: '/services',
    hasDropdown: true,
    submenu: [
      { name: 'Structured Fiber Cabling', href: '/services#fiber' },
      { name: 'Low-Voltage Installations', href: '/services#low-voltage' },
      { name: 'AI Network Monitoring', href: '/services#ai-monitoring' },
    ],
  },
  { name: 'Our Work', href: '/our-work' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const location = useLocation();

  // Only the home route has a dark hero behind a transparent navbar.
  // Every other page has a light/white top area, so the navbar must render
  // in its solid white state from the start or the links become invisible.
  const isHome = location.pathname === '/';
  const useSolidNav = !isHome || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActiveRoute = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href.split('#')[0])) return true;
    return false;
  };

  const handleNavClick = (name: string) => {
    trackNavClick(name, location.pathname);
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setDesktopServicesOpen(false);
  };

  const handleMobileMenuToggle = () => {
    const next = !isMenuOpen;
    setIsMenuOpen(next);
    trackMobileMenuToggle(next ? 'open' : 'close');
  };

  const linkColor = useSolidNav ? 'text-buckeye-gray' : 'text-white';
  const linkHover = 'hover:text-buckeye-scarlet';


  return (
    <>
      <nav
        id="navigation"
        className={`fixed w-full z-50 transition-all duration-300 ${
          useSolidNav ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center gap-6">
            <Link to="/" className="flex items-baseline shrink-0" onClick={() => handleNavClick('Logo')}>
              <span className="font-display text-xl md:text-2xl font-semibold text-buckeye-scarlet tracking-tight">
                Buckeye
              </span>
              <span className={`font-display text-xl md:text-2xl font-normal italic ml-1.5 ${useSolidNav ? 'text-buckeye-black/70' : 'text-white/80'}`}>
                DataCom
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) =>
                item.hasDropdown ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setDesktopServicesOpen(true)}
                    onMouseLeave={() => setDesktopServicesOpen(false)}
                  >
                    <Link
                      to={item.href}
                      onClick={() => handleNavClick(item.name)}
                      className={`flex items-center gap-1 px-3 py-2 min-h-11 text-sm font-medium transition-colors ${linkColor} ${linkHover} ${
                        isActiveRoute(item.href) ? 'text-buckeye-scarlet' : ''
                      }`}
                    >
                      {item.name}
                      <ChevronDown size={16} className={`transition-transform ${desktopServicesOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    {desktopServicesOpen && (
                      <div className="absolute top-full left-0 pt-2 w-64">
                        <div className="bg-white rounded-md shadow-lg border border-gray-100 py-2">
                          {item.submenu?.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={() => {
                                trackSubmenuClick(item.name, sub.name);
                                handleNavClick(sub.name);
                              }}
                              className="block px-4 py-2 text-sm text-buckeye-gray hover:text-buckeye-scarlet hover:bg-gray-50 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleNavClick(item.name)}
                    className={`px-3 py-2 min-h-11 inline-flex items-center text-sm font-medium transition-colors ${linkColor} ${linkHover} ${
                      isActiveRoute(item.href) ? 'text-buckeye-scarlet' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
              <Link
                to="/contact"
                onClick={() => handleNavClick('Get a Quote')}
                className="ml-3 inline-flex items-center px-5 py-2.5 min-h-11 bg-buckeye-scarlet text-white text-sm font-semibold rounded-md hover:bg-buckeye-scarlet/90 transition-colors"
              >
                Get a Quote
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={handleMobileMenuToggle}
                className={`p-2 min-w-11 min-h-11 flex items-center justify-center transition-colors ${
                  useSolidNav ? 'text-buckeye-gray hover:text-buckeye-scarlet' : 'text-white hover:text-gray-200'
                }`}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
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

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute inset-0 bg-buckeye-black text-white transform transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-6 pt-20 border-b border-gray-700">
              <div className="flex items-baseline">
                <span className="text-buckeye-scarlet font-display text-xl font-semibold tracking-tight">Buckeye</span>
                <span className="text-white/70 font-display text-xl font-normal italic ml-1.5">DataCom</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-buckeye-scarlet transition-colors p-2 min-w-11 min-h-11"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            <nav className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <Link
                            to={item.href}
                            onClick={() => handleNavClick(item.name)}
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
                            className="p-4 hover:text-buckeye-scarlet transition-colors min-h-[48px] min-w-11 flex items-center"
                            aria-label="Toggle services submenu"
                          >
                            <ChevronDown
                              size={24}
                              className={`transform transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isServicesOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="pl-8 space-y-1 border-l-2 border-gray-600 ml-2">
                            {item.submenu?.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.href}
                                onClick={() => {
                                  trackSubmenuClick(item.name, sub.name);
                                  handleNavClick(sub.name);
                                }}
                                className="block py-3 px-4 text-lg transition-colors min-h-[48px] flex items-center text-gray-300 hover:text-white hover:bg-gray-800/50"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => handleNavClick(item.name)}
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
                <Link
                  to="/contact"
                  onClick={() => handleNavClick('Get a Quote')}
                  className="block mt-6 py-4 px-6 text-lg font-semibold text-center bg-buckeye-scarlet text-white rounded-md hover:bg-buckeye-scarlet/90 transition-colors min-h-[48px]"
                >
                  Get a Quote
                </Link>
              </div>
            </nav>

            <div className="px-6 py-8 border-t border-gray-700 bg-gray-900/50">
              <div className="space-y-3">
                <p className="text-gray-400 text-sm font-medium">Get in touch</p>
                <div className="space-y-2">
                  <a href="tel:+16146792486" className="block text-white text-lg font-semibold hover:text-buckeye-scarlet transition-colors">
                    (614) 679-2486
                  </a>
                  <a href="mailto:info@buckeyedatacom.com" className="block text-gray-300 hover:text-white transition-colors">
                    info@buckeyedatacom.com
                  </a>
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
