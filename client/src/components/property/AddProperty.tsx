import { useState } from "react";
import Dialog from "../ui/Dialog";
import PropertyCreateForm from "./AddPropertyForm";
import Button from "../ui/Button";
import { Plus } from "lucide-react";

export default function AddProperty() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center">
        <Plus className="h-5 w-5 mr-1" />
        Add Property
      </Button>
      <Dialog isOpen={open} onClose={() => setOpen(false)}>
        <PropertyCreateForm />
      </Dialog>
    </>
  );
}
