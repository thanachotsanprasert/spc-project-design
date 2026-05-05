import { createContext, useContext, ReactNode } from "react"
const AuthContext = createContext<any>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={{ user: { role: "owner" } }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
