import { create } from 'zustand';
import { tastingAPI } from '../services/api.js';

// Helper function to apply filters
const applyFilters = (cafes, cafeTypeFilter, neighborhoodFilter, featureFilter) => {
  if (!cafes) return [];
  let filtered = cafes;
  if (cafeTypeFilter && cafeTypeFilter !== 'all') {
    filtered = filtered.filter((c) => c.category === cafeTypeFilter);
  }
  if (neighborhoodFilter && neighborhoodFilter !== 'all') {
    filtered = filtered.filter((c) => c.locations?.some((l) => l.neighborhood === neighborhoodFilter));
  }
  if (featureFilter && featureFilter !== 'all') {
    filtered = filtered.filter((c) =>
      c.locations?.some((l) => (l.features || []).includes(featureFilter)) ||
      (c.features || []).includes(featureFilter)
    );
  }
  return filtered;
};

export const useCafeStore = create((set, get) => ({
  themeMode: localStorage.getItem('themeMode') || 'light',

  setThemeMode: (mode) => {
    localStorage.setItem('themeMode', mode);
    set({ themeMode: mode });
  },

  tastingFormOpen: false,
  setTastingFormOpen: (open) => set({ tastingFormOpen: open }),

  cafes: [],
  setCafes: (cafes) =>
    set((state) => {
      // Deduplicate cafes by _id to prevent duplicate keys in React
      const uniqueCafes = Array.isArray(cafes)
        ? cafes.filter((cafe, index, self) => index === self.findIndex((c) => c._id === cafe._id))
        : [];

      const filteredCafes =
        state.cafeTypeFilter || state.neighborhoodFilter || state.featureFilter
          ? applyFilters(uniqueCafes, state.cafeTypeFilter, state.neighborhoodFilter, state.featureFilter)
          : state.filteredCafes;
      return { cafes: uniqueCafes, filteredCafes };
    }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

  cafeTypeFilter: '',
  neighborhoodFilter: '',
  featureFilter: '',
  filteredCafes: [],

  setCafeTypeFilter: (filter) =>
    set((state) => {
      const filteredCafes = applyFilters(state.cafes, filter, state.neighborhoodFilter, state.featureFilter);
      return { cafeTypeFilter: filter, filteredCafes };
    }),

  setNeighborhoodFilter: (filter) =>
    set((state) => {
      const filteredCafes = applyFilters(state.cafes, state.cafeTypeFilter, filter, state.featureFilter);
      return { neighborhoodFilter: filter, filteredCafes };
    }),

  setFeatureFilter: (filter) =>
    set((state) => {
      const filteredCafes = applyFilters(state.cafes, state.cafeTypeFilter, state.neighborhoodFilter, filter);
      return { featureFilter: filter, filteredCafes };
    }),

  clearFilters: () => set({ cafeTypeFilter: '', neighborhoodFilter: '', featureFilter: '', filteredCafes: [] }),

  // Tastings state

  tastings: [],
  setTastings: (tastings) => set({ tastings }),
  loading: false,
  setLoading: (loading) => set({ loading }),

  fetchTastings: async () => {
    set({ loading: true });
    try {
      const publicTastings = await tastingAPI.getPublic();
      const allTastings = publicTastings.data || [];

      // Deduplicate tastings by _id to prevent duplicate keys in React
      const uniqueTastings = Array.isArray(allTastings)
        ? allTastings.filter(
            (tasting, index, self) => index === self.findIndex((t) => t._id === tasting._id)
          )
        : [];

      set({ tastings: uniqueTastings });
    } catch (error) {
      console.error('Error fetching tastings:', error);
      // Only set empty array if we have no tastings at all
      set({ tastings: [] });
    }
    set({ loading: false });
  },

  // Form options
  options: {},
  setOptions: (options) => set({ options }),

  // User state
  user: null,
  setUser: (user) => set({ user }),
  username: localStorage.getItem('username') || '',
  setUsername: (username) => {
    const value = String(username ?? '');
    localStorage.setItem('username', value);
    set({ username: value });
  },
  userToken: localStorage.getItem('userToken') || null,
  setUserToken: (token) => set({ userToken: token }),

  //user Submissions

  userSubmissions: [],
  setUserSubmissions: (subs) => set({ userSubmissions: subs }),

  // Error state
  fetchError: '',
  setFetchError: (err) => set({ fetchError: err }),

  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  tastingsPerPage: 12,
  setTastingsPerPage: (num) => set({ tastingsPerPage: num }),
}));
