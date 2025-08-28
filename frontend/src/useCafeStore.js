import { create } from "zustand";

export const useCafeStore = create((set) => ({
  // Theme mode state
  themeMode: localStorage.getItem("themeMode") || "light",
  setThemeMode: (mode) => {
    localStorage.setItem("themeMode", mode);
    set({ themeMode: mode });
  },
  // Cafe and search state
  cafes: [],
  setCafes: (cafes) => set({ cafes }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

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
      const { tastingAPI } = await import("./services/api.js");
      if (isLoggedIn) {
        const userTastings = await tastingAPI.getUserTastings();
        allTastings = userTastings.data || [];
      } else {
        const publicTastings = await tastingAPI.getPublic();
        allTastings = publicTastings.data || [];
      }
      set({ tastings: allTastings });
    } catch {
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
  isLoggedIn: !!localStorage.getItem("userToken"),
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),

  //user Submissions

  userSubmissions: [],
  setUserSubmissions: (subs) => set({ userSubmissions: subs }),

  // Error state
  fetchError: "",
  setFetchError: (err) => set({ fetchError: err }),

  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  tastingsPerPage: 10,
  setTastingsPerPage: (num) => set({ tastingsPerPage: num }),
}));
