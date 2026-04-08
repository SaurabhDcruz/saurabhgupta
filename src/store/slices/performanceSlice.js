const createPerformanceSlice = (set) => ({
  fps: 60,
  deviceTier: 'high',
  setFps: (fps) => set({ fps }),
  setDeviceTier: (tier) => set({ deviceTier: tier }),
})

export default createPerformanceSlice
