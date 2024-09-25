import React from 'react';

// Define the AgentRowProps interface
interface AgentRowProps {
  id: number; 
  name: string;
  email: string;
  role: 'Admin' | 'Agent';
  autoAssigned: boolean; // Keep autoAssigned as boolean
  iconColor: string;
  isSelected: boolean;
  onClick: () => void;
}

const AgentRow: React.FC<AgentRowProps> = ({ id, name, email, role, autoAssigned, iconColor, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center h-[65px] w-full border-b border-gray-300 cursor-pointer ${
        isSelected ? 'bg-blue-100' : 'bg-white'
      } hover:bg-gray-100 transition-colors duration-200`} 
      onClick={onClick}
    >
      {/* First Column: Gmail Icon (First letter of Gmail) */}
      <div className="w-[50px] flex justify-center items-center">
        <div className={`h-[40px] w-[40px] ${iconColor} text-white rounded-full flex items-center justify-center`}>
          {email.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Second Column: Name */}
      <div className="w-[150px] pl-4">
        <span className="text-sm font-semibold capitalize">{name}</span>
        <span className="block text-xs text-gray-500">{email}</span>
      </div>

      {/* Third Column: Role (Admin or Agent) */}
      <div className="w-[100px] flex justify-center items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${role === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
          {role}
        </span>
      </div>

      {/* Fourth Column: Assignment Status */}
      <div className="flex-grow pl-4">
        <span className={`text-xs font-semibold ${autoAssigned ? 'text-green-500' : 'text-red-500'}`}>
          {autoAssigned ? 'Assigned' : "Can't be auto assigned"}
        </span>
      </div>
    </div>
  );
};

export default AgentRow;
