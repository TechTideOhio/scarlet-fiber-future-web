// SEO Configuration for Buckeye DataCom
// This file centralizes all SEO-related constants

export const SEO_CONFIG = {
  siteName: 'Buckeye DataCom',
  siteUrl: 'https://buckeyedatacom.com',
  defaultTitle: 'Enterprise Fiber & Network Solutions in Ohio',
  defaultDescription: 'Professional fiber optic cabling, low-voltage installations, and AI-driven network monitoring for Ohio businesses. Get a quote in 24 hours.',
  defaultImage: '/lovable-uploads/5abebf68-15fe-4395-a93d-89fa7ac4cc89.png',
  twitterHandle: '@buckeyedatacom',
  locale: 'en_US',
  
  // Business Info for structured data
  business: {
    name: 'Buckeye DataCom',
    legalName: 'Buckeye DataCom LLC',
    telephone: '+1-614-679-2486',
    email: 'info@buckeyedatacom.com',
    address: {
      streetAddress: '6057 Sweetleaf Ct',
      addressLocality: 'Galloway',
      addressRegion: 'OH',
      postalCode: '43119',
      addressCountry: 'US'
    },
    geo: {
      latitude: 39.9048,
      longitude: -83.2051
    },
    priceRange: '$$-$$$',
    areaServedRadius: '100 miles'
  },

  // Pages configuration
  pages: {
    home: {
      title: 'Enterprise Fiber & Network Solutions in Ohio',
      description: 'Professional fiber optic cabling, low-voltage installations, and AI-driven network monitoring for Ohio businesses. Get a quote in 24 hours.',
      keywords: 'fiber optic, network infrastructure, Ohio, Columbus, low-voltage, cabling, AI monitoring'
    },
    services: {
      title: 'Our Services | Fiber, Low-Voltage & AI Network Monitoring',
      description: 'Enterprise-grade fiber cabling, low-voltage installations, and intelligent network monitoring solutions. Serving Columbus, Ohio and surrounding areas.',
      keywords: 'fiber cabling, low-voltage installation, network monitoring, AI, enterprise network'
    },
    ourWork: {
      title: 'Our Portfolio | Network Infrastructure Projects',
      description: 'View our completed fiber optic, data center, and network infrastructure projects across Ohio industries.',
      keywords: 'network projects, fiber installation, data center, portfolio, case studies'
    },
    about: {
      title: 'About Us | Ohio\'s Trusted Network Infrastructure Experts',
      description: 'Learn about Buckeye DataCom\'s team, certifications, and 15+ years of experience in enterprise network solutions.',
      keywords: 'about us, team, certifications, network experts, Ohio'
    },
    contact: {
      title: 'Contact Us | Get a Free Network Infrastructure Quote',
      description: 'Contact Buckeye DataCom for fiber optic cabling, low-voltage installations, and network monitoring. Quotes returned within 24 hours.',
      keywords: 'contact, quote, free estimate, network services, Ohio'
    },
    notFound: {
      title: 'Page Not Found',
      description: 'The page you\'re looking for doesn\'t exist. Return to our homepage to explore our network infrastructure services.'
    }
  }
} as const;

export type PageKey = keyof typeof SEO_CONFIG.pages;
