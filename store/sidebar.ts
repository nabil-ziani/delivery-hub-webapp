import { create } from 'zustand'

interface SidebarState {
    isExpanded: boolean
    setIsExpanded: (expanded: boolean) => void
    toggle: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isExpanded: true,
    setIsExpanded: (expanded) => set({ isExpanded: expanded }),
    toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
})) 