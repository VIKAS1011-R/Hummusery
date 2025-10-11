import { useEffect } from 'react';

export const useScrollToSection = () => {
  useEffect(() => {
    // Function to scroll to hash with proper offset
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        // Wait for page to be fully loaded
        const performScroll = () => {
          const element = document.querySelector(hash);
          if (element) {
            // Get the element's position
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elementTop = rect.top + scrollTop;
            
            // Calculate offset (navbar height + some padding)
            const offset = 120; // Increased offset for better positioning
            const targetPosition = elementTop - offset;
            
            // Scroll to position
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            });
          }
        };

        // Try immediately, then with delays
        performScroll();
        setTimeout(performScroll, 100);
        setTimeout(performScroll, 300);
        setTimeout(performScroll, 500);
      }
    };

    // Handle page load
    if (document.readyState === 'complete') {
      scrollToHash();
    } else {
      window.addEventListener('load', scrollToHash);
    }

    // Handle hash changes
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      window.removeEventListener('load', scrollToHash);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrollTop;
      const offset = 120;
      const targetPosition = elementTop - offset;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  return { scrollToSection };
};