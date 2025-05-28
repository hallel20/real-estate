import { create } from 'zustand';
import { Inquiry } from '../types';
import { api } from "../lib/axiosInstance";

interface InquiryState {
  inquiries: Inquiry[];
  userInquiries: Inquiry[];
  propertyInquiries: Inquiry[];
  isLoading: boolean;
  error: string | null;

  fetchInquiries: () => Promise<void>;
  fetchUserInquiries: (userId: string) => Promise<void>;
  fetchPropertyInquiries: (propertyId: string) => Promise<void>;
  createInquiry: (
    inquiry: Omit<Inquiry, "id" | "createdAt" | "status">
  ) => Promise<void>;
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => Promise<void>;
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: [],
  userInquiries: [],
  propertyInquiries: [],
  isLoading: false,
  error: null,

  fetchInquiries: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      const response = await api.get<Inquiry[]>("/inquiries");
      const inquiries = response.data;
      set({ inquiries, isLoading: false });
    } catch {
      set({ error: "Failed to fetch inquiries", isLoading: false });
    }
  },

  fetchUserInquiries: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      const response = await api.get<Inquiry[]>(`/inquiries/user/${userId}`);
      const inquiries: Inquiry[] = response.data; // Replace with actual API response

      set({ userInquiries: inquiries, isLoading: false });
    } catch {
      set({ error: "Failed to fetch user inquiries", isLoading: false });
    }
  },

  fetchPropertyInquiries: async (propertyId) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      const response = await api.get<Inquiry[]>(
        `/inquiries/property/${propertyId}`
      );
      const inquiries: Inquiry[] = response.data; // Replace with actual API response

      const propInqs = inquiries.filter((i) => i.property_id === propertyId);
      set({ propertyInquiries: propInqs, isLoading: false });
    } catch {
      set({ error: "Failed to fetch property inquiries", isLoading: false });
    }
  },

  createInquiry: async (inquiry) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<Inquiry>("/inquiries", inquiry);

      const newInquiry: Inquiry = response.data; // Assuming the API returns the created inquiry

      set((state) => ({
        inquiries: [...state.inquiries, newInquiry],
        isLoading: false,
      }));
    } catch {
      set({ error: "Failed to create inquiry", isLoading: false });
      throw new Error("Failed to create inquiry");
    }
  },

  updateInquiryStatus: async (id, status) => {
    set({ isLoading: true, error: null });

    try {
      await api.put<Inquiry>(`/inquiries/${id}`, { status });

      const state = get();
      const inquiries = state.inquiries;
      const index = state.inquiries.findIndex((i) => i.id === id);

      if (index !== -1) {
        set((state) => ({
          inquiries: state.inquiries.map((i) =>
            i.id === id ? inquiries[index] : i
          ),
          userInquiries: state.userInquiries.map((i) =>
            i.id === id ? inquiries[index] : i
          ),
          propertyInquiries: state.propertyInquiries.map((i) =>
            i.id === id ? inquiries[index] : i
          ),
          isLoading: false,
        }));
      } else {
        set({ error: "Inquiry not found", isLoading: false });
      }
    } catch {
      set({ error: "Failed to update inquiry status", isLoading: false });
    }
  },
}));