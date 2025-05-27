import { lazy, Suspense, useState } from "react";
import Dialog from "../ui/Dialog";
import Button from "../ui/Button";
import { Edit } from "lucide-react";
import { Property } from "../../types";
import Spinner from "../Loading";

const PropertyCreateForm = lazy(() => import("./PropertyForm"));

export default function EditProperty({
  title,
  property,
}: {
  title?: string;
  property: Property;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center"
      >
        <Edit className="h-4 w-4 mr-1" /> {title || "Edit"}
      </Button>
      <Dialog isOpen={open} onClose={handleClose}>
        <Suspense fallback={<Spinner />}>
          <PropertyCreateForm onClose={handleClose} property={property} />
        </Suspense>
      </Dialog>
    </>
  );
}
