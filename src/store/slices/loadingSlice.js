const createLoadingSlice = (set) => ({
  loadingProgress: 0,
  loadingComplete: false,
  loadingError: null,
  setLoadingProgress: (value) =>
    set({ loadingProgress: value, loadingComplete: value >= 100 }),
  setLoadingComplete: (value) => set({ loadingComplete: value }),
  setLoadingError: (error) => set({ loadingError: error }),
});

export default createLoadingSlice;
