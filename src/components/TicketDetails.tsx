 
import React from 'react';
 
import { useParams } from 'react-router-dom';
import MessageBox from './MessageBox';
import TicketInfo from './TicketInfo';
 
 
const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
 
    return (
      <div className="app-container bg-blue-500 flex h-[100vh]">
 
        <div className="left-panel bg-red-500 w-[860px] h-full overflow-y-auto">
          <MessageBox ticketId={id!} />
        </div>
 
       
        <div className="right-panel flex-grow bg-white h-full overflow-y-auto">
          <TicketInfo id={id!} />
        </div>
      </div>
    );
  };
 
 
 
 
export default TicketDetails;
 
 