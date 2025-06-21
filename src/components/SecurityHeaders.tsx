
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Set security-related meta tags and headers
    const setSecurityMeta = () => {
      // Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';";
      
      // X-Frame-Options
      const frameMeta = document.createElement('meta');
      frameMeta.httpEquiv = 'X-Frame-Options';
      frameMeta.content = 'DENY';
      
      // X-Content-Type-Options
      const contentTypeMeta = document.createElement('meta');
      contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
      contentTypeMeta.content = 'nosniff';
      
      // Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      
      // Permissions Policy
      const permissionsMeta = document.createElement('meta');
      permissionsMeta.httpEquiv = 'Permissions-Policy';
      permissionsMeta.content = 'camera=(), microphone=(), geolocation=(), interest-cohort=()';

      // Only add if not already present
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        document.head.appendChild(cspMeta);
      }
      if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        document.head.appendChild(frameMeta);
      }
      if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        document.head.appendChild(contentTypeMeta);
      }
      if (!document.querySelector('meta[name="referrer"]')) {
        document.head.appendChild(referrerMeta);
      }
      if (!document.querySelector('meta[http-equiv="Permissions-Policy"]')) {
        document.head.appendChild(permissionsMeta);
      }
    };

    setSecurityMeta();
  }, []);

  return null;
};

export default SecurityHeaders;
