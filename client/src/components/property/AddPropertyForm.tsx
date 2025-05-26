"use client"; // If using Next.js App Router

import React, { useState } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
  UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertyFormSchema,
  PropertyFormData,
} from "../../lib/schemas/propertySchema";
import { createProperty } from "../../services/api";
import ImageUploader from "../ImageUploader"; // Adjust path as needed
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const inputClass =
  "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500";

const PropertyCreateForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<PropertyFormData>({
    // @ts-ignore
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: undefined, // Or a specific number if you have a default
      property_type: "",
      status: "",
      bedrooms: undefined,
      bathrooms: undefined,
      area: undefined,
      year_built: undefined,
      amenities: "",
      images: [],
    },
  });

  const currentImages = watch("images", []);

  const onSubmit: SubmitHandler<PropertyFormData> = async (data) => {
    setApiError(null);
    setIsSubmittingApi(true);
    try {
      // The 'images' field is already part of 'data' thanks to ImageUploader and react-hook-form
      console.log("Submitting data:", data);
      const response = await createProperty(data);
      console.log("Property created:", response);
      toast.success("Property created successfully!");
      // Optionally reset form or redirect:
      reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to create property:", error);
      setApiError(
        error.response?.data?.error ||
          error.message ||
          "An unknown error occurred."
      );
    } finally {
      setIsSubmittingApi(false);
    }
  };

  const isActuallySubmitting = isFormSubmitting || isSubmittingApi;

  return (
    <form
      onSubmit={handleSubmit(onSubmit as any)}
      className="space-y-6 p-4 text-start max-w-2xl mx-auto bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        Create New Property Listing
      </h2>

      <div>
        <Input
          className={inputClass}
          label="Title"
          id="title"
          type="text"
          fullWidth
          {...register("title")}
          disabled={isActuallySubmitting}
          error={errors.title?.message}
        />
      </div>

      <div>
        <Textarea
          label="Description"
          id="description"
          {...register("description")}
          rows={4}
          fullWidth
          disabled={isActuallySubmitting}
          error={errors.description?.message}
        />
      </div>

      <div>
        <Input
          className={inputClass}
          label="Location"
          id="location"
          type="text"
          fullWidth
          {...register("location")}
          disabled={isActuallySubmitting}
          error={errors.location?.message}
        />
      </div>

      <div>
        <Input
          className={inputClass}
          label="Price"
          id="price"
          type="number"
          step="any"
          {...register("price")}
          disabled={isActuallySubmitting}
          error={errors.price?.message}
        />
      </div>

      {/* Image Uploader */}
      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          // Pass setValue and the field name to ImageUploader
          // currentImages is watched for potential display in ImageUploader
          <ImageUploader
            setValue={setValue as UseFormSetValue<PropertyFormData>}
            name="images"
            currentImages={field.value || []}
          />
        )}
      />
      {errors.images && (
        <p className="mt-1 text-xs text-red-600">{errors.images.message}</p>
      )}
      {currentImages && currentImages.length > 0 && (
        <div className="mt-2 hidden">
          <p className="text-sm font-medium text-gray-700">Uploaded Images:</p>
          <ul className="list-disc list-inside">
            {currentImages.map((url, index) => (
              <li key={index} className="text-xs truncate">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Select
            className={inputClass}
            label="Property Type"
            fullWidth
            {...register("property_type")}
            options={[
              { value: "", label: "------------------" },
              { value: "house", label: "House" },
              { value: "apartment", label: "Apartment" },
              { value: "land", label: "Land" },
              { value: "commercial", label: "Commercial" },
            ]}
            disabled={isActuallySubmitting}
            error={errors.property_type?.message}
          />
        </div>
        <div>
          <Select
            label="Status"
            {...register("status")}
            id="status"
            className={inputClass}
            options={[
              { value: "", label: "------------------" },
              { value: "for-sale", label: "For Sale" },
              { value: "for-rent", label: "For Rent" },
            ]}
            fullWidth
            disabled={isActuallySubmitting}
            error={errors.status?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            className={inputClass}
            label="Bedrooms"
            id="bedrooms"
            type="number"
            {...register("bedrooms")}
            disabled={isActuallySubmitting}
            error={errors.bedrooms?.message}
          />
        </div>
        <div>
          <Input
            className={inputClass}
            label="Bathrooms"
            id="bathrooms"
            type="number"
            {...register("bathrooms")}
            disabled={isActuallySubmitting}
            error={errors.bathrooms?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            className={inputClass}
            label="Area (sq ft / sq m)"
            id="area"
            type="number"
            step="any"
            {...register("area")}
            disabled={isActuallySubmitting}
            error={errors.area?.message}
          />
        </div>
        <div>
          <Input
            className={inputClass}
            label="Year Built"
            id="year_built"
            type="number"
            {...register("year_built")}
            disabled={isActuallySubmitting}
            error={errors.year_built?.message}
          />
        </div>
      </div>

      <div>
        <Textarea
          label="Amenities (comma-separated)"
          id="amenities"
          {...register("amenities")}
          rows={3}
          fullWidth
          placeholder="e.g., Pool, Gym, Parking"
          disabled={isActuallySubmitting}
          error={errors.amenities?.message}
        />
      </div>

      {apiError && (
        <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
          {apiError}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isActuallySubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400"
        >
          {isActuallySubmitting ? "Submitting..." : "Create Property"}{" "}
          &nbsp;&nbsp;{" "}
          {isActuallySubmitting && (
            <Loader className="animate-spin h-8 w-8 text-blue-500" />
          )}
        </button>
      </div>
    </form>
  );
};

export default PropertyCreateForm;
