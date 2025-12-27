import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '@/config/seo';

// Organization Schema - Global
export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.business.name,
    legalName: SEO_CONFIG.business.legalName,
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/lovable-uploads/5abebf68-15fe-4395-a93d-89fa7ac4cc89.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SEO_CONFIG.business.telephone,
      contactType: 'customer service',
      email: SEO_CONFIG.business.email,
      areaServed: 'US',
      availableLanguage: 'English'
    },
    address: {
      '@type': 'PostalAddress',
      ...SEO_CONFIG.business.address
    },
    sameAs: [
      // Add social media URLs when available
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// LocalBusiness Schema - For Homepage
export const LocalBusinessSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SEO_CONFIG.siteUrl,
    name: SEO_CONFIG.business.name,
    image: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
    url: SEO_CONFIG.siteUrl,
    telephone: SEO_CONFIG.business.telephone,
    email: SEO_CONFIG.business.email,
    priceRange: SEO_CONFIG.business.priceRange,
    address: {
      '@type': 'PostalAddress',
      ...SEO_CONFIG.business.address
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SEO_CONFIG.business.geo.latitude,
      longitude: SEO_CONFIG.business.geo.longitude
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: SEO_CONFIG.business.geo.latitude,
        longitude: SEO_CONFIG.business.geo.longitude
      },
      geoRadius: SEO_CONFIG.business.areaServedRadius
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Service Schema - For Services Page
interface ServiceSchemaProps {
  services: Array<{
    name: string;
    description: string;
    url?: string;
  }>;
}

export const ServiceSchema = ({ services }: ServiceSchemaProps) => {
  const schemas = services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.business.name,
      url: SEO_CONFIG.siteUrl
    },
    areaServed: {
      '@type': 'State',
      name: 'Ohio'
    },
    url: service.url || `${SEO_CONFIG.siteUrl}/services`
  }));

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.siteUrl}${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// WebSite Schema with SearchAction
export const WebsiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.business.name
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ContactPage Schema
export const ContactPageSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Buckeye DataCom',
    description: SEO_CONFIG.pages.contact.description,
    url: `${SEO_CONFIG.siteUrl}/contact`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.business.name,
      telephone: SEO_CONFIG.business.telephone,
      email: SEO_CONFIG.business.email,
      address: {
        '@type': 'PostalAddress',
        ...SEO_CONFIG.business.address
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
