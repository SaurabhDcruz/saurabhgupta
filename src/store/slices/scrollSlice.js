const createScrollSlice = (set) => ({
  currentSection: 'hero',
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollDirection: 'down',
  setScrollState: ({ scrollProgress, scrollVelocity, scrollDirection }) =>
    set({ scrollProgress, scrollVelocity, scrollDirection }),
  setCurrentSection: (section) => set({ currentSection: section }),
})

export default createScrollSlice
