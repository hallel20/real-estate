import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../../components/ui/Button";
import ImageUploader from "../../../components/ImageUploader"; // Assuming this is the correct path
import { useAuthStore } from "../../../store/authStore"; // To get the updateProfile function

interface UserProfile {
  username: string;
  email: string;
  profile_image?: string; // This will now be an array of strings if ImageUploader supports multiple, or single string
  // For ImageUploader, it's better to handle it as an array of URLs, even if it's just one.
  // Or, if ImageUploader is designed for a single image, it can be a single string.
  // Let's assume ImageUploader will set a single URL string for profileImage.
  // If ImageUploader sets an array, the type should be string[]
}

// Define Zod schema for form validation
const profileFormSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    images: z.array(z.string().url("Invalid image URL")).optional(), // ImageUploader provides an array of URLs
  })
  .refine(
    (data) => {
      // if password is provided, confirmPassword must match
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"], // path of error
    }
  );

// Infer the type from the Zod schema
type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileSettingsTabProps {
  user: UserProfile;
}

const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ user }) => {
  const { updateProfile, isLoading, error } = useAuthStore((state) => ({
    updateProfile: state.updateProfile, // Assuming updateProfile exists and handles the API call
    isLoading: state.isLoading,
    error: state.error,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      images: user?.profile_image ? [user.profile_image] : [], // ImageUploader expects an array
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    const profileDataToUpdate: Partial<UserProfile> & { password?: string } = {
      username: data.username,
      email: data.email,
      profile_image:
        data.images && data.images.length > 0
          ? data.images[0]
          : user.profile_image, // Take the first image or keep old
    };
    if (data.password && data.password.length > 0) {
      // Ensure password is not an empty string if provided
      profileDataToUpdate.password = data.password;
    }
    console.log("Profile update data:", profileDataToUpdate);
    await updateProfile(profileDataToUpdate); // Uncomment when updateProfile is ready
  };

  // Watch the 'images' field from react-hook-form to pass to ImageUploader
  const currentImages = watch("images") || [];

  useEffect(() => {
    // Reset form if user prop changes
    setValue("username", user?.username || "");
    setValue("email", user?.email || "");
    setValue("images", user?.profile_image ? [user.profile_image] : []);
  }, [user, setValue]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Profile Settings
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register("username")}
                className={`w-full rounded-md border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {" "}
                New Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className={`w-full rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Leave blank to keep current password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {" "}
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className={`w-full rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Leave blank to keep current password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <ImageUploader<ProfileFormData>
              setValue={setValue}
              name="images"
              singleImage
              currentImages={currentImages}
              // You might want to add maxFiles={1} if this is strictly for a single profile image
            />
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">
                {errors.images.message || (errors.images as any)?.root?.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-right">
              {typeof error === "string" ? error : "An error occurred."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
