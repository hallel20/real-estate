import { create } from "zustand";
import { User } from "../types";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { api } from "../lib/axiosInstance";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void | boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string
  ) => Promise<number | void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Custom storage object to handle potential errors during storage access (e.g., in private browsing mode)
const safeLocalStorage: StateStorage = {
  getItem: (name: string): string | Promise<string | null> | null => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.warn(`Error reading localStorage item "${name}":`, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void | Promise<void> => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn(`Error setting localStorage item "${name}":`, error);
    }
  },
  removeItem: (name: string): void | Promise<void> => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn(`Error removing localStorage item "${name}":`, error);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post(`/auth/login`, {
            email,
            password,
          });

          const user = response.data.user || response.data;
          set({
            user: user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response && error.response.status === 401
              ? "Invalid email or password"
              : error.response?.data?.error ||
                "An error occurred. Please try again.";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      register: async (
        username,
        email,
        password,
        first_name,
        last_name,
        phone_number
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post(`/auth/register`, {
            username,
            email,
            password,
            first_name,
            last_name,
            phone_number,
          });

          const newUser = response.data;
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response.status;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error ||
            "Registration failed. Please try again.";
          set({ error: errorMessage, isLoading: false });
          return error.response?.status;
        }
      },

      logout: async () => {
        try {
          await api.post(`/auth/logout`, {});
          toast.success("Logged out successfully");
          // When logging out, explicitly clear persisted state for user and isAuthenticated
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          console.error("Logout failed:", error);
          toast.error("Logout failed. Please try again.");
        }
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          // const response = await api.put(`/users/profile`, userData);
          await new Promise((resolve) => setTimeout(resolve, 500));
          // const updatedUser = response.data;

          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false,
          }));
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error || "Failed to update profile";
          set({ error: errorMessage, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage", // Name of the item in storage (must be unique)
      storage: createJSONStorage(() => safeLocalStorage), // Use safeLocalStorage wrapper
      // Only persist 'user' and 'isAuthenticated'.
      // 'isLoading' and 'error' are transient and should reset on app load.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Optional: Custom logic on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset transient states on rehydration
          state.isLoading = false;
          state.error = null;
        }
      },
    }
  )
);
