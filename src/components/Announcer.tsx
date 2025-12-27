import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

interface AnnouncerContextValue {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue | null>(null);

/**
 * Hook to access the announcer context
 */
export const useAnnouncer = () => {
  const context = useContext(AnnouncerContext);
  if (!context) {
    // Return a no-op if not within provider
    return { announce: () => {} };
  }
  return context;
};

/**
 * Provider for screen reader announcements
 */
export const AnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const location = useLocation();

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      // Small delay to ensure screen readers pick up the change
      setTimeout(() => setAssertiveMessage(message), 100);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 100);
    }
  }, []);

  // Announce route changes
  useEffect(() => {
    const pageNames: Record<string, string> = {
      '/': 'Home page',
      '/services': 'Services page',
      '/our-work': 'Our Work page',
      '/about': 'About Us page',
      '/contact': 'Contact page',
    };

    const pageName = pageNames[location.pathname] || 'Page';
    announce(`Navigated to ${pageName}`);
  }, [location.pathname, announce]);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      
      {/* Polite announcements - for non-urgent updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      
      {/* Assertive announcements - for urgent updates */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
};

export default AnnouncerProvider;
