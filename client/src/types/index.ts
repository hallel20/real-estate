export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  profileImage?: string;
  createdAt: string;
}

export interface PropertyResponse {
  total: number;
  pages: number;
  current_page: number;
  page_size: number;
  properties: Property[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  user?: User; // Optional, can be populated with user details
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
  propertyType: "house" | "apartment" | "land" | "commercial";
  status: "for-sale" | "for-rent";
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number; // in sq ft
    yearBuilt?: number;
    parking?: number;
  };
  amenities: string[];
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
}

export interface PropertyFilter {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: Property['propertyType'];
  status?: Property['status'];
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  keywords?: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  userId: string;
  message: string;
  contactEmail: string;
  contactPhone?: string;
  createdAt: string;
  status: 'pending' | 'responded' | 'closed';
}