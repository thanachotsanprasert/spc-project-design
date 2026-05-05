import { create } from 'zustand'
import { Message, AIContext } from '../types'

interface AIWidgetState {
  isOpen: boolean;
  isMinimized: boolean;
  unreadCount: number;
  messages: Message[];
  pageContext: AIContext | null;
  open: () => void;
  close: () => void;
  toggleMinimize: () => void;
  sendMessage: (text: string) => void;
  addAIMessage: (text: string) => void;
  setPageContext: (ctx: AIContext) => void;
  incrementUnread: () => void;
  clearMessages: () => void;
}

export const useAIWidgetStore = create<AIWidgetState>((set) => ({
  isOpen: false,
  isMinimized: false,
  unreadCount: 0,
  messages: [],
  pageContext: null,
  open: () => set({ isOpen: true, unreadCount: 0 }),
  close: () => set({ isOpen: false }),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  sendMessage: (text) => set((state) => ({
    messages: [...state.messages, { id: Date.now().toString(), role: 'user', text, timestamp: new Date() }]
  })),
  addAIMessage: (text) => set((state) => ({
    messages: [...state.messages, { id: Date.now().toString(), role: 'ai', text, timestamp: new Date() }],
    unreadCount: state.isOpen ? state.unreadCount : state.unreadCount + 1
  })),
  setPageContext: (ctx) => set({ pageContext: ctx }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  clearMessages: () => set({ messages: [] }),
}))
