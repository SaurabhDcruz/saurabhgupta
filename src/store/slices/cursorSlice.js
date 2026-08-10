const createCursorSlice = (set) => ({
  cursorState: {
    x: 0,
    y: 0,
    hover: false,
    active: false,
  },
  setCursorState: (cursorState) => set((state) => ({
    cursorState: {
      ...state.cursorState,
      ...cursorState,
    },
  })),
})

export default createCursorSlice
