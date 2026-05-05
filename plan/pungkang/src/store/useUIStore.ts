import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean;
  activePopup: 'profile' | 'notifications' | 'settings' | null;
  tableView: 'grid' | 'list';
  toggleSidebar: () => void;
  setSidebarOpen: (val: boolean) => void;
  openPopup: (name: UIState['activePopup']) => void;
  closeAllPopups: () => void;
  setTableView: (view: UIState['tableView']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activePopup: null,
  tableView: 'grid',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
  openPopup: (name) => set({ activePopup: name }),
  closeAllPopups: () => set({ activePopup: null }),
  setTableView: (view) => set({ tableView: view }),
}))
