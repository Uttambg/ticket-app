import React from 'react';
import './SuccessPopup.css';

interface SuccessPopupProps {
  message: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
