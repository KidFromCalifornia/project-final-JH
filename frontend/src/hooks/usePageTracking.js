import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getVisitorId = () => {
  let id = localStorage.getItem('visitorId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('visitorId', id);
  }
  return id;
};

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('admin') === 'true') return;
    if (location.pathname.startsWith('/admin')) return;

    fetch(`${API_BASE}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: location.pathname, visitorId: getVisitorId() }),
    }).catch(() => {});
  }, [location.pathname]);
};

export default usePageTracking;
