import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin sessions
    if (localStorage.getItem('admin') === 'true') return;

    fetch(`${API_BASE}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: location.pathname }),
    }).catch(() => {});
  }, [location.pathname]);
};

export default usePageTracking;
