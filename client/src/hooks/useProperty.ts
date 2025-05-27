import { useState, useCallback } from "react";
import { deleteProperty as apiDeleteProperty } from "../services/api"; // Adjust path as needed
import toast from "react-hot-toast";

// Define a more specific type for the data returned by apiDeleteProperty if known
// For example, if it returns { message: string } or is just void/empty
type DeletePropertyResponse = any; // Replace 'any' with the actual expected response type

interface UseDeletePropertyOptions {
  onSuccess?: (data: DeletePropertyResponse, id: string) => void;
  onError?: (error: Error, id: string) => void;
}

export const useDeleteProperty = (options?: UseDeletePropertyOptions) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (id: string) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await apiDeleteProperty(id);
        setIsPending(false);
        console.log("Property deleted successfully (manual hook)");
        if (options?.onSuccess) {
          options.onSuccess(result, id);
        }
        toast.success("Property deleted successfully.");
        return result;
      } catch (err: any) {
        const e =
          err instanceof Error
            ? err
            : new Error(
                String(err) || "An unknown error occurred during deletion"
              );
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to delete property. Please try again."
        );
        setError(e);
        setIsPending(false);
        console.error("Error deleting property (manual hook):", e);
        if (options?.onError) {
          options.onError(e, id);
        }
        // You might want to re-throw the error if the caller needs to await and catch it
        // throw e;
        return undefined; // Or handle as per your error strategy
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options?.onSuccess, options?.onError] // Dependencies for useCallback
  );

  return { mutate, isPending, error };
};
