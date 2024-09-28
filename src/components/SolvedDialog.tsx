import React from 'react';

interface SolvedDialogProps {
  onCloseTicket: () => void; // Function to set status to Closed
  onReopenTicket: () => void; // Function to set status to In Progress
}

const SolvedDialog: React.FC<SolvedDialogProps> = ({ onCloseTicket, onReopenTicket }) => {
  return (
    <div className="border border-blue-400  bg-blue-50 rounded-lg p-4 mt-4 shadow-md">
      <p className="text-gray-700 mb-4 text-center">This ticket is marked as solved. Do you want to close it?</p>
      <div className="flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
          onClick={onCloseTicket}
        >
          Yes
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          onClick={onReopenTicket}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default SolvedDialog;

