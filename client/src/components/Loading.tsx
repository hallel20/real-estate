import React from "react";
import { Loader2 } from "lucide-react"; // Import a loader icon from lucid-react

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 50, // Default size
  color = "text-blue-600", // Default color using Tailwind text color class
  className = "",
}) => {
  return (
    <div className={`min-h-96 flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${color}`} size={size} />
    </div>
  );
};
export default Spinner;
