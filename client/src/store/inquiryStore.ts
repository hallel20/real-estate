import { create } from 'zustand';
import { Inquiry } from '../types';

interface InquiryState {
  inquiries: Inquiry[];
  userInquiries: Inquiry[];
  propertyInquiries: Inquiry[];
  isLoading: boolean;
  error: string | null;
  
  fetchInquiries: () => Promise<void>;
  fetchUserInquiries: (userId: string) => Promise<void>;
  fetchPropertyInquiries: (propertyId: string) => Promise<void>;
  createInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => Promise<void>;
}

// Mock data for inquiries
const mockInquiries: Inquiry[] = [
  {
    id: '1',
    propertyId: '1',
    userId: '2',
    message: 'I am interested in this property and would like to schedule a viewing this weekend. Is that possible?',
    contactEmail: 'user@example.com',
    contactPhone: '555-123-4567',
    createdAt: '2023-06-15T14:30:00Z',
    status: 'pending',
  },
  {
    id: '2',
    propertyId: '2',
    userId: '2',
    message: 'Does this apartment come with parking? And are pets allowed?',
    contactEmail: 'user@example.com',
    createdAt: '2023-06-20T10:15:00Z',
    status: 'responded',
  },
  {
    id: '3',
    propertyId: '3',
    userId: '1',
    message: 'I would like to know if the price is negotiable and what are the property taxes?',
    contactEmail: 'admin@realestate.com',
    contactPhone: '555-987-6543',
    createdAt: '2023-06-25T16:45:00Z',
    status: 'closed',
  },
];

export const useInquiryStore = create<InquiryState>((set) => ({
  inquiries: [],
  userInquiries: [],
  propertyInquiries: [],
  isLoading: false,
  error: null,
  
  fetchInquiries: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ inquiries: mockInquiries, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch inquiries', isLoading: false });
    }
  },
  
  fetchUserInquiries: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userInqs = mockInquiries.filter(i => i.userId === userId);
      set({ userInquiries: userInqs, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user inquiries', isLoading: false });
    }
  },
  
  fetchPropertyInquiries: async (propertyId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const propInqs = mockInquiries.filter(i => i.propertyId === propertyId);
      set({ propertyInquiries: propInqs, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch property inquiries', isLoading: false });
    }
  },
  
  createInquiry: async (inquiry) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInquiry: Inquiry = {
        ...inquiry,
        id: (mockInquiries.length + 1).toString(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      
      mockInquiries.push(newInquiry);
      set(state => ({
        inquiries: [...state.inquiries, newInquiry],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create inquiry', isLoading: false });
    }
  },
  
  updateInquiryStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = mockInquiries.findIndex(i => i.id === id);
      
      if (index !== -1) {
        mockInquiries[index] = {
          ...mockInquiries[index],
          status,
        };
        
        set(state => ({
          inquiries: state.inquiries.map(i => i.id === id ? mockInquiries[index] : i),
          userInquiries: state.userInquiries.map(i => i.id === id ? mockInquiries[index] : i),
          propertyInquiries: state.propertyInquiries.map(i => i.id === id ? mockInquiries[index] : i),
          isLoading: false,
        }));
      } else {
        set({ error: 'Inquiry not found', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to update inquiry status', isLoading: false });
    }
  },
}));