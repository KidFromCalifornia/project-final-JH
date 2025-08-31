// Stockholm Type font loader following official Stockholm guidelines
// Based on: https://font.stockholm.se/dokumentation/
const loadStockholmFont = () => {
  // Check if font is already loaded
  if (
    document.querySelector('link[href*="stockholm-type"]') ||
    document.querySelector('style[data-font="stockholm-type"]')
  ) {
    return;
  }

  const loadFontDirectly = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Official Stockholm font service URL (protocol-relative for better compatibility)
    link.href = '//font.stockholm.se/css/stockholm-type.css';
    link.setAttribute('data-font', 'stockholm-type');

    link.onload = () => {
      // Following Stockholm's convention for font loading classes
      document.documentElement.classList.add('wf-stockholmtype-active');
      document.documentElement.classList.add('wf-stockholmtype-n4-active'); // Regular
      document.documentElement.classList.add('wf-stockholmtype-n7-active'); // Bold
      document.documentElement.classList.add('wf-active');
      console.log('Stockholm Type font loaded successfully');
    };

    link.onerror = () => {
      // Following Stockholm's convention for inactive font state
      document.documentElement.classList.add('wf-stockholmtype-inactive');
      document.documentElement.classList.add('wf-stockholmtype-n4-inactive');
      document.documentElement.classList.add('wf-stockholmtype-n7-inactive');
      console.warn(
        'Stockholm Type font failed to load - using Verdana fallback as per Stockholm guidelines'
      );
    };

    document.head.appendChild(link);
  };

  // Load font when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFontDirectly);
  } else {
    loadFontDirectly();
  }
};

// Load font when module is imported
loadStockholmFont();

export default loadStockholmFont;
