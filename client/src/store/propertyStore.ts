import { create } from 'zustand';
import { Property, PropertyFilter } from '../types';

interface PropertyState {
  properties: Property[];
  featuredProperties: Property[];
  userProperties: Property[];
  favoriteProperties: string[]; // Array of property IDs
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  filters: PropertyFilter;
  
  fetchProperties: () => Promise<void>;
  fetchFeaturedProperties: () => Promise<void>;
  fetchUserProperties: (userId: string) => Promise<void>;
  fetchPropertyById: (id: string) => Promise<void>;
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  toggleFavorite: (propertyId: string) => void;
  setFilters: (filters: PropertyFilter) => void;
}

// Mock data for properties
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    description: 'A stunning modern villa with panoramic ocean views, featuring an infinity pool, home theater, and smart home technology throughout.',
    price: 1250000,
    location: {
      address: '123 Oceanview Drive',
      city: 'Malibu',
      state: 'CA',
      zipCode: '90265',
      latitude: 34.0259,
      longitude: -118.7798,
    },
    propertyType: 'house',
    status: 'for-sale',
    features: {
      bedrooms: 5,
      bathrooms: 4.5,
      area: 4200,
      yearBuilt: 2020,
      parking: 3,
    },
    amenities: ['Pool', 'Home Theater', 'Smart Home', 'Ocean View', 'Gated Community'],
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    ],
    ownerId: '1',
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Downtown Luxury Apartment',
    description: 'Elegant high-rise apartment in the heart of downtown with floor-to-ceiling windows offering spectacular city views.',
    price: 750000,
    location: {
      address: '456 City Center Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90017',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    propertyType: 'apartment',
    status: 'for-sale',
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      yearBuilt: 2018,
      parking: 2,
    },
    amenities: ['Gym', 'Concierge', 'Rooftop Terrace', 'City View', 'Pet Friendly'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
    ],
    ownerId: '1',
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-02-10T10:15:00Z',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Charming Suburban Home',
    description: 'Beautiful family home in a quiet suburban neighborhood with a large backyard, updated kitchen, and close to excellent schools.',
    price: 550000,
    location: {
      address: '789 Maple Street',
      city: 'Pasadena',
      state: 'CA',
      zipCode: '91101',
      latitude: 34.1478,
      longitude: -118.1445,
    },
    propertyType: 'house',
    status: 'for-sale',
    features: {
      bedrooms: 4,
      bathrooms: 2.5,
      area: 2400,
      yearBuilt: 1995,
      parking: 2,
    },
    amenities: ['Backyard', 'Updated Kitchen', 'Fireplace', 'Near Schools', 'Quiet Neighborhood'],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
    ],
    ownerId: '2',
    createdAt: '2023-03-05T14:20:00Z',
    updatedAt: '2023-03-05T14:20:00Z',
  },
  {
    id: '4',
    title: 'Luxury Beachfront Condo',
    description: 'Stunning beachfront condo with direct access to the beach, featuring high-end finishes and breathtaking ocean views.',
    price: 3500,
    location: {
      address: '101 Shoreline Drive',
      city: 'Santa Monica',
      state: 'CA',
      zipCode: '90401',
      latitude: 34.0195,
      longitude: -118.4912,
    },
    propertyType: 'apartment',
    status: 'for-rent',
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      yearBuilt: 2015,
      parking: 2,
    },
    amenities: ['Beach Access', 'Ocean View', 'Pool', 'Fitness Center', 'Security'],
    images: [
      'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    ],
    ownerId: '1',
    createdAt: '2023-04-12T09:45:00Z',
    updatedAt: '2023-04-12T09:45:00Z',
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Commercial Office Space',
    description: 'Prime commercial office space in a prestigious business district with modern amenities and excellent accessibility.',
    price: 1200000,
    location: {
      address: '555 Business Plaza',
      city: 'Irvine',
      state: 'CA',
      zipCode: '92618',
      latitude: 33.6846,
      longitude: -117.8265,
    },
    propertyType: 'commercial',
    status: 'for-sale',
    features: {
      bedrooms: 0,
      bathrooms: 4,
      area: 5000,
      yearBuilt: 2010,
      parking: 20,
    },
    amenities: ['Conference Rooms', 'Reception Area', 'High-Speed Internet', 'Security System', 'Parking Garage'],
    images: [
      'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg',
      'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg',
      'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
    ],
    ownerId: '1',
    createdAt: '2023-05-20T11:30:00Z',
    updatedAt: '2023-05-20T11:30:00Z',
  },
];

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  featuredProperties: [],
  userProperties: [],
  favoriteProperties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  filters: {},
  
  fetchProperties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { filters } = get();
      let filteredProperties = [...mockProperties];
      
      // Apply filters
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        filteredProperties = filteredProperties.filter(p => 
          p.location.address.toLowerCase().includes(locationLower) ||
          p.location.city.toLowerCase().includes(locationLower) ||
          p.location.state.toLowerCase().includes(locationLower) ||
          p.location.zipCode.includes(filters.location!)
        );
      }
      
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
      }
      
      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
      }
      
      if (filters.status) {
        filteredProperties = filteredProperties.filter(p => p.status === filters.status);
      }
      
      if (filters.minBedrooms) {
        filteredProperties = filteredProperties.filter(p => p.features.bedrooms >= filters.minBedrooms!);
      }
      
      if (filters.minBathrooms) {
        filteredProperties = filteredProperties.filter(p => p.features.bathrooms >= filters.minBathrooms!);
      }
      
      if (filters.minArea) {
        filteredProperties = filteredProperties.filter(p => p.features.area >= filters.minArea!);
      }
      
      if (filters.keywords) {
        const keywordsLower = filters.keywords.toLowerCase();
        filteredProperties = filteredProperties.filter(p => 
          p.title.toLowerCase().includes(keywordsLower) ||
          p.description.toLowerCase().includes(keywordsLower) ||
          p.amenities.some(a => a.toLowerCase().includes(keywordsLower))
        );
      }
      
      set({ properties: filteredProperties, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch properties', isLoading: false });
    }
  },
  
  fetchFeaturedProperties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const featured = mockProperties.filter(p => p.isFeatured);
      set({ featuredProperties: featured, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch featured properties', isLoading: false });
    }
  },
  
  fetchUserProperties: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userProps = mockProperties.filter(p => p.ownerId === userId);
      set({ userProperties: userProps, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user properties', isLoading: false });
    }
  },
  
  fetchPropertyById: async (id) => {
    set({ isLoading: true, error: null, currentProperty: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const property = mockProperties.find(p => p.id === id);
      
      if (property) {
        set({ currentProperty: property, isLoading: false });
      } else {
        set({ error: 'Property not found', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch property details', isLoading: false });
    }
  },
  
  createProperty: async (property) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProperty: Property = {
        ...property,
        id: (mockProperties.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockProperties.push(newProperty);
      set(state => ({
        properties: [...state.properties, newProperty],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create property', isLoading: false });
    }
  },
  
  updateProperty: async (id, property) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = mockProperties.findIndex(p => p.id === id);
      
      if (index !== -1) {
        mockProperties[index] = {
          ...mockProperties[index],
          ...property,
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          properties: state.properties.map(p => p.id === id ? mockProperties[index] : p),
          currentProperty: state.currentProperty?.id === id ? mockProperties[index] : state.currentProperty,
          isLoading: false,
        }));
      } else {
        set({ error: 'Property not found', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to update property', isLoading: false });
    }
  },
  
  deleteProperty: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = mockProperties.findIndex(p => p.id === id);
      
      if (index !== -1) {
        mockProperties.splice(index, 1);
        
        set(state => ({
          properties: state.properties.filter(p => p.id !== id),
          userProperties: state.userProperties.filter(p => p.id !== id),
          currentProperty: state.currentProperty?.id === id ? null : state.currentProperty,
          isLoading: false,
        }));
      } else {
        set({ error: 'Property not found', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to delete property', isLoading: false });
    }
  },
  
  toggleFavorite: (propertyId) => {
    set(state => {
      const favorites = [...state.favoriteProperties];
      const index = favorites.indexOf(propertyId);
      
      if (index === -1) {
        favorites.push(propertyId);
      } else {
        favorites.splice(index, 1);
      }
      
      return { favoriteProperties: favorites };
    });
  },
  
  setFilters: (filters) => {
    set({ filters });
    get().fetchProperties();
  },
}));