import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
  initialFocus?: 'first' | 'container' | 'none';
  returnFocus?: boolean;
}

/**
 * Hook to trap focus within a container (for modals, dialogs, etc.)
 */
export const useFocusTrap = ({
  isActive,
  onEscape,
  initialFocus = 'first',
  returnFocus = true,
}: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
    
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => el.offsetParent !== null); // Only visible elements
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab key for focus trapping
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: move backwards
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move forwards
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isActive, onEscape, getFocusableElements]
  );

  // Set up event listeners and initial focus
  useEffect(() => {
    if (isActive) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Set initial focus
      if (initialFocus === 'first') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          // Small delay to ensure the container is rendered
          setTimeout(() => {
            focusableElements[0].focus();
          }, 10);
        }
      } else if (initialFocus === 'container') {
        containerRef.current?.focus();
      }

      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element
      if (returnFocus && previousActiveElement.current && !isActive) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, initialFocus, returnFocus, handleKeyDown, getFocusableElements]);

  // Return focus when deactivating
  useEffect(() => {
    if (!isActive && returnFocus && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isActive, returnFocus]);

  return containerRef;
};

export default useFocusTrap;
