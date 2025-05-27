import { useState } from "react";
import Dialog from "../ui/Dialog";
import Button from "../ui/Button";
import { Loader, Trash2 } from "lucide-react";
import { Property } from "../../types";
import { useDeleteProperty } from "../../hooks/useProperty";
import { usePropertyStore } from "../../store/propertyStore";

export default function DeleteProperty({
  title,
  property,
}: {
  title?: string;
  property: Property;
}) {
  const { mutate: deleteProperty, isPending } = useDeleteProperty();
  const { fetchUserProperties } = usePropertyStore();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
      await fetchUserProperties(); // Refresh user properties after deletion
      handleClose();
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => setOpen(true)}
        className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {title || "Delete"}
      </Button>
      <Dialog isOpen={open} onClose={handleClose}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-4">
            Are you sure you want to delete this property? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(property.id)}
              disabled={isPending}
            >
              {isPending && <Loader size={20} className="mr-1 animate-spin" />}
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
