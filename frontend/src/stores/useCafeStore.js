import { create } from 'zustand';
import { tastingAPI } from '../services/api.js';

// Helper function to apply filters
const applyFilters = (cafes, cafeTypeFilter, neighborhoodFilter) => {
  if (!cafes) return [];

  let filtered = cafes;

  if (cafeTypeFilter && cafeTypeFilter !== 'all') {
    filtered = filtered.filter((cafe) => cafe.category === cafeTypeFilter);
  }

  if (neighborhoodFilter && neighborhoodFilter !== 'all') {
    filtered = filtered.filter((cafe) => cafe.locations?.[0]?.neighborhood === neighborhoodFilter);
  }

  return filtered;
};

export const useCafeStore = create((set) => ({
  themeMode: localStorage.getItem('themeMode') || 'light',
  setThemeMode: (mode) => {
    localStorage.setItem('themeMode', mode);
    set({ themeMode: mode });
  },

  cafes: [],
  setCafes: (cafes) =>
    set((state) => {
      // Deduplicate cafes by _id to prevent duplicate keys in React
      const uniqueCafes = Array.isArray(cafes)
        ? cafes.filter((cafe, index, self) => index === self.findIndex((c) => c._id === cafe._id))
        : [];

      const filteredCafes =
        state.cafeTypeFilter || state.neighborhoodFilter
          ? applyFilters(uniqueCafes, state.cafeTypeFilter, state.neighborhoodFilter)
          : state.filteredCafes;
      return { cafes: uniqueCafes, filteredCafes };
    }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

  cafeTypeFilter: '',
  neighborhoodFilter: '',
  filteredCafes: [],

  setCafeTypeFilter: (filter) =>
    set((state) => {
      const filteredCafes = applyFilters(state.cafes, filter, state.neighborhoodFilter);
      return { cafeTypeFilter: filter, filteredCafes };
    }),

  setNeighborhoodFilter: (filter) =>
    set((state) => {
      const filteredCafes = applyFilters(state.cafes, state.cafeTypeFilter, filter);
      return { neighborhoodFilter: filter, filteredCafes };
    }),

  clearFilters: () => set({ cafeTypeFilter: '', neighborhoodFilter: '', filteredCafes: [] }),

  // Tastings state

  tastings: [],
  setTastings: (tastings) => set({ tastings }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  editingTasting: null,
  setEditingTasting: (tasting) => set({ editingTasting: tasting }),
  deletingTasting: null,
  setDeletingTasting: (tasting) => set({ deletingTasting: tasting }),

  fetchTastings: async (isLoggedIn) => {
    set({ loading: true });
    try {
      let allTastings = [];

      // Always fetch public tastings first
      try {
        const publicTastings = await tastingAPI.getPublic();
        console.log('Public tastings fetched:', publicTastings);
        allTastings = publicTastings.data || [];
      } catch (publicError) {
        console.error('Error fetching public tastings:', publicError);
        // Don't return early, continue to try user tastings
      }

      // If logged in, also fetch user's private tastings and merge them
      if (isLoggedIn) {
        try {
          const userTastings = await tastingAPI.getUserTastings();
          console.log('User tastings fetched:', userTastings);
          const userTastingsData = userTastings.data || [];

          // Merge user tastings with public tastings (user tastings first)
          allTastings = [...userTastingsData, ...allTastings];
        } catch (userError) {
          console.error('Error fetching user tastings (continuing with public only):', userError);
          // Continue with just public tastings
        }
      }

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
  username: localStorage.getItem('username') || null,
  setUsername: (username) => set({ username }),
  userToken: localStorage.getItem('userToken') || null,
  setUserToken: (token) => set({ userToken: token }),
  isLoggedIn: !!localStorage.getItem('userToken'),
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),

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
