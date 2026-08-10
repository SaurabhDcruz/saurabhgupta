const createUiSlice = (set) => ({
  menuOpen: false,
  themeMode: 'dark',
  showCursor: true,
  setMenuOpen: (open) => set({ menuOpen: open }),
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
  setThemeMode: (mode) => set({ themeMode: mode }),
  setShowCursor: (visible) => set({ showCursor: visible }),
})

export default createUiSlice
