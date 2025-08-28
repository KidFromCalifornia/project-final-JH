// Optimized font loading for Stockholm Type - reduces head bloat
const loadStockholmFont = () => {
  // Skip WebFont library and load directly via CSS for better performance
  const loadFontDirectly = () => {
    // Check if font is already loaded
    if (document.querySelector('link[href*="stockholm-type"]')) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://font.stockholm.se/css/stockholm-type.css'; // Use HTTPS
    link.onload = () => {
      document.documentElement.classList.add('wf-stockholmtype-active');
      document.documentElement.classList.add('wf-stockholmtype-n4-active');
      document.documentElement.classList.add('wf-stockholmtype-n7-active');
      document.documentElement.classList.add('wf-active');
    };
    link.onerror = () => {
      document.documentElement.classList.add('wf-stockholmtype-inactive');
      console.warn('Stockholm Type font failed to load');
    };
    document.head.appendChild(link);
  };

  // Load font immediately
  loadFontDirectly();
};

// Load font when module is imported
loadStockholmFont();

export default loadStockholmFont;
