/**
 * Shared error handler for API calls
 * Standardizes error handling across all API requests
 */

export const handleApiError = (error, showSnackbar, defaultMessage = 'An error occurred') => {
  console.log('API Error:', error);

  // Network connectivity issues
  if (
    (error.name === 'TypeError' && error.message.includes('fetch')) ||
    error.message.includes('NetworkError') ||
    error.message.includes('Failed to fetch') ||
    !navigator.onLine
  ) {
    showSnackbar(
      "We couldn't reach the server. Please check your internet connection and try again.",
      'error'
    );
  }
  // Request timeout
  else if (error.message.includes('timeout') || error.message.includes('Request timeout')) {
    showSnackbar('Request timed out. Please try again.', 'error');
  }
  // Other errors
  else {
    const errorMessage = error.message || defaultMessage;
    showSnackbar(errorMessage, 'error');
  }
};
