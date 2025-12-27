// Analytics utility for Google Analytics 4
// Provides type-safe event tracking with graceful fallback

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type EventCategory = 'form' | 'cta' | 'navigation' | 'error' | 'engagement';

export interface AnalyticsEvent {
  eventName: string;
  category: EventCategory;
  parameters?: Record<string, string | number | boolean>;
}

// Check if analytics is available
export const isAnalyticsAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Initialize GA4 (called automatically when script loads)
export const initializeAnalytics = (): void => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.log('[Analytics] No GA Measurement ID configured - tracking disabled');
    return;
  }

  // gtag should already be initialized by the script in index.html
  if (isAnalyticsAvailable()) {
    console.log('[Analytics] GA4 initialized');
  }
};

// Core event tracking function
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>
): void => {
  if (!isAnalyticsAvailable()) {
    if (import.meta.env.DEV) {
      console.log('[Analytics Dev]', eventName, parameters);
    }
    return;
  }

  window.gtag?.('event', eventName, parameters);
};

// Track page views
export const trackPageView = (pagePath: string, pageTitle: string): void => {
  if (!isAnalyticsAvailable()) {
    if (import.meta.env.DEV) {
      console.log('[Analytics Dev] Page View:', pagePath, pageTitle);
    }
    return;
  }

  window.gtag?.('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// Form tracking
export const trackFormStart = (formName: string): void => {
  trackEvent('form_start', {
    form_name: formName,
  });
};

export const trackFormSubmission = (
  formName: string,
  success: boolean,
  additionalData?: Record<string, string | number | boolean>
): void => {
  trackEvent('form_submit', {
    form_name: formName,
    success,
    ...additionalData,
  });
};

export const trackFormError = (formName: string, fieldName: string, errorMessage: string): void => {
  trackEvent('form_field_error', {
    form_name: formName,
    field_name: fieldName,
    error_message: errorMessage,
  });
};

// CTA click tracking
export const trackCTAClick = (
  buttonLabel: string,
  destination: string,
  pageLocation: string
): void => {
  trackEvent('cta_click', {
    button_label: buttonLabel,
    destination,
    page_location: pageLocation,
  });
};

// Navigation tracking
export const trackNavClick = (menuItem: string, fromPage: string): void => {
  trackEvent('nav_click', {
    menu_item: menuItem,
    from_page: fromPage,
  });
};

export const trackMobileMenuToggle = (action: 'open' | 'close'): void => {
  trackEvent('mobile_menu_toggle', {
    action,
  });
};

export const trackSubmenuClick = (parentItem: string, subItem: string): void => {
  trackEvent('submenu_click', {
    parent_menu: parentItem,
    sub_item: subItem,
  });
};

// Quote widget tracking
export const trackQuoteCalculate = (projectSize: number, estimatedPrice: number): void => {
  trackEvent('quote_calculate', {
    project_size: projectSize,
    estimated_price: estimatedPrice,
  });
};

export const trackQuoteSubmit = (
  projectSize: number,
  projectType: string,
  estimatedPrice: number
): void => {
  trackEvent('quote_submit', {
    project_size: projectSize,
    project_type: projectType,
    estimated_price: estimatedPrice,
  });
};

export const trackFileUpload = (fileType: string, success: boolean): void => {
  trackEvent('file_upload', {
    file_type: fileType,
    success,
  });
};

// Error tracking
export const trackError = (
  errorMessage: string,
  errorStack?: string,
  context?: string
): void => {
  if (!isAnalyticsAvailable()) {
    if (import.meta.env.DEV) {
      console.log('[Analytics Dev] Error:', errorMessage, context);
    }
    return;
  }

  window.gtag?.('event', 'exception', {
    description: errorMessage,
    fatal: false,
    error_stack: errorStack?.substring(0, 500),
    context,
  });
};

// User properties
export const setUserProperties = (properties: Record<string, string | number | boolean>): void => {
  if (!isAnalyticsAvailable()) {
    return;
  }

  window.gtag?.('set', 'user_properties', properties);
};

// Consent management
export const updateConsent = (granted: boolean): void => {
  if (!isAnalyticsAvailable()) {
    return;
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
};
