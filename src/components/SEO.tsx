import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '@/config/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noIndex?: boolean;
  children?: React.ReactNode;
}

const SEO = ({
  title,
  description = SEO_CONFIG.defaultDescription,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage = SEO_CONFIG.defaultImage,
  noIndex = false,
  children
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | ${SEO_CONFIG.siteName}`
    : `${SEO_CONFIG.siteName} | ${SEO_CONFIG.defaultTitle}`;
  
  const fullCanonicalUrl = canonicalUrl 
    ? `${SEO_CONFIG.siteUrl}${canonicalUrl}`
    : undefined;
  
  const fullOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : `${SEO_CONFIG.siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional meta tags */}
      <meta name="author" content={SEO_CONFIG.siteName} />
      <meta name="geo.region" content="US-OH" />
      <meta name="geo.placename" content="Columbus" />
      
      {children}
    </Helmet>
  );
};

export default SEO;
