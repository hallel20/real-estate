import { create } from "zustand";
import { Property, PropertyFilter, PropertyResponse } from "../types";
import { api } from "../lib/axiosInstance"; // Assuming api is here, adjust if necessary

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
  fetchUserProperties: () => Promise<void>;
  fetchPropertyById: (id: string) => Promise<void>;
  toggleFavorite: (propertyId: string) => void;
  setFilters: (filters: PropertyFilter) => void;
}

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
      const { filters } = get();
      const params = new URLSearchParams();

      // Construct query parameters from filters
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters.propertyType) {
        params.append('propertyType', filters.propertyType);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.minBedrooms) {
        params.append('minBedrooms', filters.minBedrooms.toString());
      }
      if (filters.minBathrooms) {
        params.append('minBathrooms', filters.minBathrooms.toString());
      }
      if (filters.minArea) {
        params.append('minArea', filters.minArea.toString());
      }
      if (filters.keywords) {
        params.append('keywords', filters.keywords);
      }

      const response = await api.get<PropertyResponse>(`/properties?${params.toString()}`);
      const properties: Property[] = response.data.properties;

      set({ properties: properties, isLoading: false });
    } catch {
      set({ error: "Failed to fetch properties", isLoading: false });
    }
  },

  fetchFeaturedProperties: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<PropertyResponse>(
        "/properties?variant=featured"
      );
      const properties: Property[] = response.data.properties;

      const featured = properties.filter((p) => p.isFeatured);
      set({ featuredProperties: featured, isLoading: false });
    } catch {
      set({ error: "Failed to fetch featured properties", isLoading: false });
    }
  },

  fetchUserProperties: async () => {
    set({ isLoading: true, error: null });

    // The userId parameter might not be needed if the backend endpoint /properties/me
    // determines the user from the authentication token.
    // If userId is still needed for some reason by the backend, you might pass it as a query param.
    try {
      const response = await api.get<Property[]>(`/properties?variant=mine`); // Or `/properties/user/${userId}` if your API expects the ID
      set({ userProperties: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user properties";
      console.error("Failed to fetch user properties:", error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPropertyById: async (id) => {
    set({ isLoading: true, error: null, currentProperty: null });

    try {
      const response = await api.get<Property>(`/properties/${id}`);
      const property: Property = response.data;
      if (property) {
        set({ currentProperty: property, isLoading: false });
      } else {
        set({ error: "Property not found", isLoading: false });
      }
    } catch {
      set({ error: "Failed to fetch property details", isLoading: false });
    }
  },

  toggleFavorite: (propertyId) => {
    set((state) => {
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
