import { create } from 'zustand'
import { Staff, StaffRole } from '../types'

interface AuthState {
  user: Staff | null;
  role: StaffRole | null;
  workspace: string | null;
  isAuthenticated: boolean;
  login: (user: Staff) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  workspace: null,
  isAuthenticated: false,
  login: (user) => set({ 
    user, 
    role: user.role, 
    workspace: user.area, 
    isAuthenticated: true 
  }),
  logout: () => set({ 
    user: null, 
    role: null, 
    workspace: null, 
    isAuthenticated: false 
  }),
}))
