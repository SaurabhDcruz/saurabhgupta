import { create } from "zustand";

export const useAppStore = create((set) => ({
  currentSection: 0,
  setSection: (section) => set({ currentSection: section }),
}));