import { z } from "zod";

// In your propertySchema.ts (simplified example)
export const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
  }),
  price: z.number().positive("Price must be positive"),
  property_type: z.string().min(1, "Property type is required"),
  status: z.string().min(1, "Status is required"),
  features: z.object({
    bedrooms: z
      .number()
      .int()
      .min(0, "Bedrooms must be a non-negative integer"),
    bathrooms: z.number().min(0, "Bathrooms must be a non-negative number"),
    area: z.number().positive("Area must be positive"),
    year_built: z.number().int().optional(), // Or specific year validation
  }),
  amenities: z.string().optional(), // Or refine if it should be an array processed by Zod
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
