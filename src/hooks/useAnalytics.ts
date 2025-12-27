import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent, initializeAnalytics } from '@/lib/analytics';

interface UseAnalyticsOptions {
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { trackScrollDepth = false, trackTimeOnPage = false } = options;
  const location = useLocation();
  const pageStartTime = useRef<number>(Date.now());
  const scrollMilestones = useRef<Set<number>>(new Set());

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Track page views on route change
  useEffect(() => {
    const pageTitle = document.title;
    trackPageView(location.pathname, pageTitle);
    
    // Reset tracking for new page
    pageStartTime.current = Date.now();
    scrollMilestones.current.clear();
  }, [location.pathname]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          trackEvent('scroll_depth', {
            percent: milestone,
            page_path: location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth, location.pathname]);

  // Track time on page when leaving
  useEffect(() => {
    if (!trackTimeOnPage) return;

    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
      trackEvent('time_on_page', {
        seconds: timeOnPage,
        page_path: location.pathname,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackTimeOnPage, location.pathname]);

  // Memoized tracking functions for components
  const trackCustomEvent = useCallback((eventName: string, params?: Record<string, string | number | boolean>) => {
    trackEvent(eventName, params);
  }, []);

  return {
    trackEvent: trackCustomEvent,
    currentPath: location.pathname,
  };
};

export default useAnalytics;
