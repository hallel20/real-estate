import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"), // Length check is on password, this ensures it's not empty
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^\+[1-9]\d{1,14}$/,
        "Invalid phone number format (e.g., +1234567890)"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Set error on confirmPassword field
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const {
    register: authRegister,
    isLoading,
    error: authError,
  } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // It's good practice to keep defaultValues
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone_number: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Form data submitted to onSubmit:", data); // <-- Add this line for debugging
    try {
      // Assuming authRegister expects username, email, password
      // If it can take the full data object or more fields, adjust accordingly
      const status = await authRegister(
        data.username,
        data.email,
        data.password,
        data.first_name,
        data.last_name,
        data.phone_number
      );
      if (status === 201) navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {authError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                type="text"
                label="Username"
                autoComplete="username"
                {...register("username")}
                error={errors.username?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                type="text"
                label="First Name" // Removed (Optional)
                autoComplete="first_name"
                {...register("first_name")}
                error={errors.first_name?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                type="text"
                label="Last Name" // Removed (Optional)
                autoComplete="last_name"
                {...register("last_name")}
                error={errors.last_name?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                type="tel"
                label="Phone Number" // Removed (Optional)
                autoComplete="tel"
                {...register("phone_number")}
                error={errors.phone_number?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                type="email"
                label="Email address"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                type="password"
                label="Password"
                autoComplete="new-password"
                {...register("password")}
                error={errors.password?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                type="password"
                label="Confirm password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                fullWidth
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <Button type="submit" isLoading={isLoading} fullWidth>
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
