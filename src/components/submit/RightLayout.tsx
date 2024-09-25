import React from 'react';
import { DisplayAgent } from '../../types/Ticket';// Assuming DisplayAgent is defined in this file

interface RightLayoutProps {
  agent: DisplayAgent | null; // Use DisplayAgent for typing
}

const RightLayout: React.FC<RightLayoutProps> = ({ agent }) => {
  if (!agent) {
    // Render empty state when no agent is selected
    return (
      <div className="h-full bg-white flex items-center justify-center text-gray-500">
        <span>No agent selected</span>
      </div>
    );
  }

  const emailPrefix = agent.email.split('@')[0]; // Updated to use agent.email
  const capitalizedEmailPrefix = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

  return (
    <div className="h-full bg-white flex mb-[14px] rounded-r-lg overflow-hidden">
      <div className="flex-grow m-[0px] flex flex-col">
        {/* Header */}
        <div className="h-[50px] pl-4 pt-4 bg-white font-semibold text-lg border-b border-gray-300">
          Details
        </div>

        {/* Profile Section */}
        <div className="flex-grow bg-white p-[4px]">
          <div className="w-full h-[64px] flex items-center p-[4px] border-b border-gray-300">
            {/* Gmail Icon */}
            <div className={`flex items-center justify-center h-[64px] w-[64px] bg-blue-500 text-white rounded-full`}>
              {agent.email.charAt(0).toUpperCase()} {/* Updated to use agent.email */}
            </div>

            {/* Name and Role */}
            <div className="ml-4 flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-base font-semibold">{capitalizedEmailPrefix}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${agent.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {agent.role || 'Agent'} {/* Fallback to 'Agent' if role is undefined */}
                </span>
              </div>

              {/* Gmail Address */}
              <div className="mt-1 text-sm text-gray-500">
                {agent.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightLayout;
