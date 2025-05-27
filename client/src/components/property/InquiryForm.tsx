import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { useInquiryStore } from "../../store/inquiryStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
interface InquiryFormProps {
  propertyId: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ propertyId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { createInquiry, isLoading, error } = useInquiryStore();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquirySchema = z.object({
    name: z.string().min(1, "Name is required"),
    message: z.string().min(1, "Message is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    property_id: z.string().min(1, "Property ID is required"),
  });

  type InquiryFormInfer = z.infer<typeof inquirySchema>;

  interface InquiryFormData extends InquiryFormInfer {
    property_id: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: "",
      email: user?.email || "",
      property_id: propertyId,
      name: user?.username || "", // Assuming user object has a name field
      // If user object has a name field, otherwise set to empty string
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<InquiryFormData> = async (data) => {
    try {
      await createInquiry({
        property_id: data.property_id,
        name: data.name,
        userId: user?.id || "anonymous",
        message: data.message,
        email: data.email,
      });

      setIsSubmitted(true);
      reset();
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Inquiry Sent Successfully!
        </h3>
        <p className="text-green-700 mb-4">
          Thank you for your interest. The property owner will contact you soon.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Interested in this property?
      </h3>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-blue-700 text-sm">
            You're sending this inquiry as a guest.{" "}
            <a href="/login" className="font-semibold underline">
              Login
            </a>{" "}
            to track your inquiries.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            label="Name"
            type="text"
            placeholder="Your name"
            {...register("name")}
            error={errors.name?.message}
            fullWidth
          />

          <Input
            label="Email"
            type="email"
            placeholder="Your email address"
            {...register("email")}
            error={errors.email?.message}
            fullWidth
          />

          <Textarea
            label="Message"
            placeholder="I'm interested in this property and would like to schedule a viewing..."
            rows={4}
            {...register("message")}
            error={errors.message?.message}
            fullWidth
          />

          <Button type="submit" isLoading={isLoading} fullWidth>
            Send Inquiry
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
