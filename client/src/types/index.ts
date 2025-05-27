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
  property_id: string;
  userId: string;
  message: string;
  email: string;
  name: string;
  createdAt: string;
  status: "pending" | "responded" | "closed";
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: number; // Or string, depending on your backend
  sender_id: number; // Or string
  reciever_id: number; // Or string
  property_id: number; // Or string
  inquiry_id: number | null; // Or string
  created_at: string; // ISO string
  updated_at: string; // ISO string
  // Add other fields if your backend serializes them (e.g., last message snippet, other user info)
  // last_message?: string;
  // other_user?: { id: number; username: string; /* ... */ };
}

export interface Message {
  id: number; // Or string
  chat_id: number; // Or string
  message: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  // Add sender info if needed, though often messages imply the sender is the current user
  // sender_id: number; // Or string
}