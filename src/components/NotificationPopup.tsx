import React, { useEffect } from 'react';

interface NotificationPopupProps {
  message: string;
  onClose: () => void; // Function to close the popup
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the popup after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer when component unmounts
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
      <p>{message}</p>
    </div>
  );
};

export default NotificationPopup;
