import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import createUiSlice from './slices/uiSlice.js'
import createSceneSlice from './slices/sceneSlice.js'
import createScrollSlice from './slices/scrollSlice.js'
import createCursorSlice from './slices/cursorSlice.js'
import createLoadingSlice from './slices/loadingSlice.js'
import createPerformanceSlice from './slices/performanceSlice.js'

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...createUiSlice(set, get),
        ...createSceneSlice(set, get),
        ...createScrollSlice(set, get),
        ...createCursorSlice(set, get),
        ...createLoadingSlice(set, get),
        ...createPerformanceSlice(set, get),
      }),
      {
        name: 'immersive-website-state',
        partialize: (state) => ({
          menuOpen: state.menuOpen,
          themeMode: state.themeMode,
          showCursor: state.showCursor,
          deviceTier: state.deviceTier,
        }),
      }
    )
  )
)

export default useStore
