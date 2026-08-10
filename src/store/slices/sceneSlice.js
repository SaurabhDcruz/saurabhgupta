const createSceneSlice = (set) => ({
  activeScene: 'intro',
  scenePhase: 0,
  setActiveScene: (scene) => set({ activeScene: scene }),
  setScenePhase: (phase) => set({ scenePhase: phase }),
})

export default createSceneSlice
