import { create } from "zustand";
import { IUserSession } from "../interfaces/login.interface";

interface AuthState {
  user: IUserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: IUserSession) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  setUser: (user) => {
    localStorage.setItem("authToken", user.token);
    localStorage.setItem("authUser", JSON.stringify(user));
    set({ user, isAuthenticated: true, isAdmin: user.role === "Admin" });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },
  loadFromStorage: () => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        const user = JSON.parse(stored) as IUserSession;
        set({ user, isAuthenticated: true, isAdmin: user.role === "Admin" });
      } catch {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
      }
    }
  },
}));
