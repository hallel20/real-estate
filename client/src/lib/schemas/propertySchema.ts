import { z } from "zod";

// Helper for optional number fields that might come as empty strings from HTML inputs
const optionalStringToNumber = z.preprocess(
  (val) =>
    val === "" || val === null || val === undefined ? undefined : Number(val),
  z.number().optional()
);

export const propertyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long."),
  location: z.string().min(1, "Location is required."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .positive("Price must be a positive number."),
  property_type: z.string().optional(), // e.g., "Apartment", "House". Consider a select input.
  status: z.string().optional(), // e.g., "For Sale", "For Rent". Consider a select input.
  bedrooms: optionalStringToNumber
    .refine((val) => val === undefined || (Number.isInteger(val) && val >= 0), {
      message: "Bedrooms must be a non-negative integer.",
    })
    .optional(),
  bathrooms: optionalStringToNumber
    .refine((val) => val === undefined || (Number.isInteger(val) && val >= 0), {
      message: "Bathrooms must be a non-negative integer.",
    })
    .optional(),
  area: optionalStringToNumber
    .refine((val) => val === undefined || val > 0, {
      message: "Area must be a positive number.",
    })
    .optional(),
  year_built: optionalStringToNumber
    .refine(
      (val) =>
        val === undefined ||
        (Number.isInteger(val) &&
          val > 1800 &&
          val <= new Date().getFullYear()),
      {
        message: `Year built must be an integer between 1801 and ${new Date().getFullYear()}.`,
      }
    )
    .optional(),
  amenities: z.string().optional(), // Could be a comma-separated string from a textarea
  images: z
    .array(z.string().url("Each image must be a valid URL."))
    .optional()
    .default([]), // Will be populated by Cloudinary URLs
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
