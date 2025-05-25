import React, { useState, useCallback } from "react";
import { UseFormSetValue, FieldValues, Path } from "react-hook-form";
import { api } from "../lib/axiosInstance";
import { Camera } from "lucide-react";

interface ImageUploaderProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  name: Path<T>; // The name of the field in react-hook-form for the image URLs array
  currentImages?: string[];
}

const ImageUploader = <T extends FieldValues>({
  setValue,
  name,
  currentImages = [],
}: ImageUploaderProps<T>) => {
  const [error, setError] = useState<string | null>(null);
  // Tracks uploading state for individual files or the whole batch
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      setError(null); // Clear previous errors
      const newImageUrls: string[] = [...currentImages];

      for (const file of Array.from(files)) {
        const formData = new FormData();

        formData.append("image", file); // "image_file" should match your backend's expected field name

        try {
          const response = await api.post("/upload", formData);

          const { data } = response;

          if (data.secure_url) {
            newImageUrls.push(data.secure_url);
          } else {
            console.error(
              "API upload error: secure_url not found in response",
              data
            );
            setError("Failed to get image URL from server.");
          }
        } catch (err: any) {
          console.error("Upload error:", err);
          setError(err.message || "An error occurred during upload.");
        }
      }
      setValue(name, newImageUrls as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setIsUploading(false);
    },
    [setValue, name, currentImages]
  );

  const handleRemoveImage = (imageUrlToRemove: string) => {
    const updatedImages = currentImages.filter(
      (url) => url !== imageUrlToRemove
    );
    setValue(name, updatedImages as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // Note: This only removes the image URL from the form.
    // It does not delete the image from Cloudinary.
  };

  // Generate a more unique ID for accessibility if multiple uploaders are on one page
  const uploaderId = `image-upload-${name.toString().replace(/\./g, "-")}`;

  return (
    <div>
      {/* File Input Section */}
      <div className="mb-4 flex items-center gap-3">
        <label
          htmlFor={uploaderId}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="h-5 w-5 mr-2" />
          Choose Images
        </label>
        <input
          id={uploaderId}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {isUploading && (
        <p className="text-sm text-blue-600 my-2">Uploading, please wait...</p>
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      {/* Image Previews Section */}
      {currentImages && currentImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Images:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {currentImages.map((imageUrl, index) => (
              <div
                key={imageUrl || index}
                className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden shadow"
              >
                <img
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
