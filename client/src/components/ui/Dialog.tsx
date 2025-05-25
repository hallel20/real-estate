import React, { ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "dialog-title" : undefined}
    >
      <div
        className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={(e) => e.stopPropagation()} // Prevent click inside dialog from closing it
      >
        {title && (
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h2 id="dialog-title" className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors text-2xl leading-none p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={onClose}
              aria-label="Close dialog"
            >
              &times;
            </button>
          </div>
        )}
        {!title && (
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors text-2xl leading-none p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        )}
        <div className="mt-4 text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;