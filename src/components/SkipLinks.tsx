import React from 'react';

/**
 * Skip links for keyboard navigation accessibility
 * Allows users to skip directly to main content or navigation
 */
const SkipLinks = () => {
  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="skip-link"
        tabIndex={0}
      >
        Skip to navigation
      </a>
    </div>
  );
};

export default SkipLinks;
