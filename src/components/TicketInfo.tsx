import React, { useState, useEffect } from 'react';
import { fetchTicketDetails, updateTicket, fetchAllAgents } from '../api/apiClient';
import AgentInfoDropdown from './AgentInfoDropdown';
import SolvedDialog from './SolvedDialog'; // Import the SolvedDialog component if applicable
import { DisplayAgent } from '../types/Ticket';
import NotificationPopup from './NotificationPopup';
import { useAuth } from './authContext';
 
interface TicketInfoProps {
  id: string; // ID prop passed from TicketDetails
}
 
const TicketInfo: React.FC<TicketInfoProps> = ({ id }) => {
  const [ticket, setTicket] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null); // Initial state as null
  const [priority, setPriority] = useState<string | null>(null); // Initial state as null
 
  const [isAssigned, setIsAssigned] = useState(false);
  const [showAssignmentSection, setShowAssignmentSection] = useState(false);
  const [agents, setAgents] = useState<DisplayAgent[]>([]);
  const [assignedAgentName, setAssignedAgentName] = useState<string | null>(null);
 
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
 
  const { role } = useAuth(); // Access the role from the Auth context
 
 
  const showNotification = (message: string) => {
    setNotificationMessage(message);
  };
 
  useEffect(() => {
    const loadTicketDetails = async () => {
      try {
        const ticketData = await fetchTicketDetails(id);
        setTicket(ticketData);
       
        // Set the status and priority from the backend
        setStatus(ticketData.status || '');
        setPriority(ticketData.priority || '');
 
        if (ticketData.assignedAgent) {
          setAssignedAgentName(ticketData.assignedAgent);
          setIsAssigned(true);
        } else {
          setIsAssigned(false);
          setAssignedAgentName(null);
        }
      } catch (error) {
        showNotification("Failed to fetch ticket details.");
      }
    };
 
    if (id) {
      loadTicketDetails();
    }
  }, [id]);
 
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
 
    try {
      await updateTicket(id, { status: newStatus, priority, messages: null });
      showNotification('Ticket status has been updated.');
    } catch (error) {
      showNotification('Failed to update ticket status.');
    }
  };
 
  const handlePriorityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value;
    setPriority(newPriority);
 
    try {
      await updateTicket(id, { status, priority: newPriority, messages: null });
      showNotification('Ticket priority has been updated.');
    } catch (error) {
      showNotification('Failed to update ticket priority.');
    }
  };
 
  const handleAgentSelection = (agent: DisplayAgent | null) => {
    setAssignedAgentName(agent ? agent.name : null);
    setIsAssigned(!!agent);
    setShowAssignmentSection(false);
    showNotification(agent ? `Assignee changed to ${agent.name}` : "Assignee has been removed");
  };
 
  const handleCloseTicket = async () => {
    try {
      await updateTicket(id, { status: 'Closed', priority, messages: null });
      setStatus('Closed');
      showNotification('Ticket has been closed.');
    } catch (error) {
      showNotification('Failed to close the ticket.');
    }
  };
 
  const handleReopenTicket = async () => {
    try {
      await updateTicket(id, { status: 'InProgress', priority, messages: null });
      setStatus('InProgress');
      showNotification('Ticket has been marked as In Progress.');
    } catch (error) {
      showNotification('Failed to update the ticket.');
    }
  };
 
  return (
    <div className="p-10 bg-gray-50 rounded-lg shadow-lg h-[100vh] overflow-y-auto">
      <h2 className="text-2xl text-blue-500 mb-5 font-semibold">Ticket Details</h2>
 
      {ticket ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="font-semibold">
              <p className="my-2 text-blue-500">Ticket ID:</p>
              <p className="my-2 text-blue-500">Created:</p>
              <p className="my-2 text-blue-500">Last Message:</p>
            </div>
            <div className="text-left">
              <p className="my-2">{ticket.id}</p>
              <p className="my-2">{new Date(ticket.createdAt).toLocaleDateString()}</p>
              <p className="my-2">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
 
          <p className="my-2">
            <strong>Status:</strong>
            {role === 'admin' ? (
              <select
                value={status || ''} // Display the fetched status or an empty string
                onChange={handleStatusChange}
                className="ml-3 p-1 rounded border border-grey-300 text-sm"
              >
                <option value="New">New</option>
                <option value="InProgress">InProgress</option>
                <option value="Solved">Solved</option>
                <option value="Closed">Closed</option>
              </select>
            ) : (
              <span className="ml-3 p-1 rounded border border-gray-300 text-sm">{status}</span>
            )}
          </p>
 
          <p className="my-2">
            <strong>Priority:</strong>
            {role === 'admin' ? (
              <select
                value={priority || ''} // Display the fetched priority or an empty string
                onChange={handlePriorityChange}
                className="ml-3 p-1 rounded border border-gray-300 text-sm"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            ) : (
              <span className="ml-3 p-1 rounded border border-gray-300 text-sm">{priority}</span>
            )}
          </p>
 
          {/* Render the SolvedDialog component if status is 'Solved' */}
          {status === 'Solved' && role === 'user' && (
            <SolvedDialog
              onCloseTicket={handleCloseTicket}
              onReopenTicket={handleReopenTicket}
            />
          )}
 
          {/* Agent Information Section */}
          <div className="mt-5 p-4 bg-white rounded-lg shadow-md shadow-blue-500/50">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              Agent
              {role === 'admin' && !isAssigned && (
                <button
                  className="ml-2 text-blue-500 underline hover:text-blue-700 transition duration-200"
                  onClick={() => setShowAssignmentSection(true)}
                >
                  Assign
                </button>
              )}
            </h3>
 
            {isAssigned ? (
              <div className="flex flex-col items-center p-3 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200">
                <div className="flex flex-row items-center">
                  {/* Display agent's initials */}
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white font-semibold text-lg">
                    {assignedAgentName?.charAt(0).toUpperCase()}
                  </div>
 
                  {/* Agent's name display */}
                  <div className="flex flex-col">
                    <p className="text-gray-800 p-0 m-0 font-medium text-sm">Assigned Agent:</p>
                    <p className="text-blue-600 font-bold text-base">{assignedAgentName}</p>
                  </div>
                </div>
 
               
              </div>
            ) : (
              <p className="text-gray-400">No agent assigned to this ticket.</p>
            )}
 
            {!isAssigned && showAssignmentSection && role === 'admin' && (
              <AgentInfoDropdown
                agents={agents}
                onSelect={handleAgentSelection}
                selectedAgent={null}
                onClose={() => setShowAssignmentSection(false)}
              />
            )}
          </div>
        </>
      ) : (
        <p>Loading ticket details...</p>
      )}
     
      {notificationMessage && (
        <NotificationPopup
          message={notificationMessage}
          onClose={() => setNotificationMessage(null)}
        />
      )}
    </div>
  );
};
 
export default TicketInfo;
 
 