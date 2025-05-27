import { lazy, Suspense, useState } from "react";
import Dialog from "../ui/Dialog";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import Spinner from "../Loading";

const PropertyCreateForm = lazy(() => import("./PropertyForm"));
export default function AddProperty({ title }: { title?: string }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center">
        <Plus className="h-5 w-5 mr-1" />
        {title || "Add Property"}
      </Button>
      <Dialog isOpen={open} onClose={handleClose}>
        <Suspense fallback={<Spinner />}>
          <PropertyCreateForm onClose={handleClose} />
        </Suspense>
      </Dialog>
    </>
  );
}
