// TicketDetails.tsx
import React from 'react';

import { useParams } from 'react-router-dom';
import MessageBox from './MessageBox';
import TicketInfo from './TicketInfo';

// TicketDetails.tsx
const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  
    return (
      <div className="app-container bg-blue-500 flex h-[100vh]">
        {/* Left Panel - Message Box */}
        <div className="left-panel bg-red-500 w-[860px] h-full overflow-y-auto">
          <MessageBox ticketId={id!} /> {/* Use non-null assertion */}
        </div>
  
        {/* Right Panel - Ticket Info */}
        <div className="right-panel flex-grow bg-white h-full overflow-y-auto">
          <TicketInfo id={id!} /> {/* Use non-null assertion */}
        </div>
      </div>
    );
  };
  
  
  

export default TicketDetails;
