import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean; // Added isLoading prop, optional
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText,isLoading = false, }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal if clicked outside of the modal content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-md shadow-lg w-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>×</button>
        </div>
        
        {/* Message */}
        <p className="text-gray-700">{message}</p>
        
        {/* Action buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
