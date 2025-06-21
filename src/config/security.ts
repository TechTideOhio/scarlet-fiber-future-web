
// Security Configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    CONTACT_FORM: {
      MAX_ATTEMPTS: 3,
      WINDOW_MS: 10 * 60 * 1000, // 10 minutes
    },
    QUOTE_WIDGET: {
      MAX_ATTEMPTS: 5,
      WINDOW_MS: 5 * 60 * 1000, // 5 minutes
    },
  },
  
  // File upload security
  FILE_UPLOAD: {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ],
    BLOCKED_EXTENSIONS: [
      '.exe', '.bat', '.cmd', '.scr', '.vbs', 
      '.js', '.jar', '.app', '.deb', '.pkg',
      '.dmg', '.iso', '.msi', '.run'
    ],
  },
  
  // Input validation
  INPUT_LIMITS: {
    NAME: { MIN: 2, MAX: 50 },
    EMAIL: { MAX: 254 },
    PHONE: { MAX: 20 },
    COMPANY: { MAX: 100 },
    MESSAGE: { MIN: 10, MAX: 1000 },
    PROJECT_SIZE: { MIN: 100, MAX: 1000000 },
  },
  
  // Content Security Policy
  CSP: {
    DEFAULT_SRC: "'self'",
    SCRIPT_SRC: "'self' 'unsafe-inline' https://cdn.gpteng.co",
    STYLE_SRC: "'self' 'unsafe-inline' https://fonts.googleapis.com",
    FONT_SRC: "'self' https://fonts.gstatic.com",
    IMG_SRC: "'self' data: https:",
    CONNECT_SRC: "'self' https:",
    FRAME_ANCESTORS: "'none'",
  },
  
  // Security headers
  HEADERS: {
    X_FRAME_OPTIONS: 'DENY',
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
};

// Production security checklist
export const PRODUCTION_SECURITY_CHECKLIST = {
  // Environment variables
  ENV_VARS: [
    'VITE_API_URL',
    'VITE_SITE_URL',
  ],
  
  // Security headers to verify
  REQUIRED_HEADERS: [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ],
  
  // Files to secure
  SECURE_FILES: [
    '/robots.txt',
    '/sitemap.xml',
    '/.well-known/security.txt',
  ],
  
  // Monitoring endpoints
  MONITORING: {
    HEALTH_CHECK: '/api/health',
    SECURITY_HEADERS: '/api/security-headers',
    CSP_REPORT: '/api/csp-report',
  },
};
