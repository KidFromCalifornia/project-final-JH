import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getSessionId = () => {
  let id = localStorage.getItem('scc_session');
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('scc_session', id);
  }
  return id;
};

const useFavourites = () => {
  const [saved, setSaved] = useState(new Set()); // Set of `${type}:${refId}`
  const sessionId = getSessionId();

  useEffect(() => {
    fetch(`${API_BASE}/favourites/session/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSaved(new Set(d.data.map((f) => `${f.type}:${f.refId}`)));
      })
      .catch(() => {});
  }, []);

  const toggle = useCallback(async (type, refId, refName) => {
    const key = `${type}:${refId}`;
    try {
      const res = await fetch(`${API_BASE}/favourites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, refId, refName, sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved((prev) => {
          const next = new Set(prev);
          data.saved ? next.add(key) : next.delete(key);
          return next;
        });
        return data.saved;
      }
    } catch {}
    return null;
  }, [sessionId]);

  const isSaved = (type, refId) => saved.has(`${type}:${refId}`);

  return { isSaved, toggle };
};

export default useFavourites;
