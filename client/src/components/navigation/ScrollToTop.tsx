import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page whenever the route changes.
 * This fixes the issue where pages would load at the bottom instead of the top.
 */
const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, [location]);

  return null;
};

export default ScrollToTop;
