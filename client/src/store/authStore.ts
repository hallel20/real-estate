import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// In a real application, these would be API calls to a backend
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@realestate.com',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === 'password') { // In a real app, you'd verify hashed passwords
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Invalid email or password', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Login failed. Please try again.', isLoading: false });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        set({ error: 'Email already in use', isLoading: false });
        return;
      }
      
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        username,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Registration failed. Please try again.', isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        user: state.user ? { ...state.user, ...userData } : null,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update profile', isLoading: false });
    }
  },
}));