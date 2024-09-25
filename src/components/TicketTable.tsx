import React, { useEffect, useState } from 'react';
import { Ticket , User} from '../types/Ticket'; // Assuming you're importing Ticket and User interfaces from their respective files.
import { fetchTickets, fetchUserById } from '../api/apiClient';
import useTickets from '../api/useTickets';

const TicketTable: React.FC = () => {
  const { tickets, users, loading } = useTickets(); // Use the custom hook

  // Helper to get the last message content
  const getLastMessageContent = (messages: Ticket['messages']) => {
    if (messages && messages.length > 0) {
      return messages[messages.length - 1].content;
    }
    return 'No messages';
  };

  return (
    <div className="ticket-table">
      <table>
        <thead>
          <tr>
            <th>Requester</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Agent</th>
            <th>Status</th>
            <th>Last Message</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const user = users[ticket.userId]; // Find the user data using userId
            return (
              <tr key={ticket.id}>
                <td>{user ? user.name : 'Loading...'}</td>
                <td>{user ? user.email : 'Loading...'}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.assignedAgent || 'Unassigned'}</td>
                <td>{ticket.status}</td>
                <td>  {ticket.messages.length > 0 ? (
                      <span dangerouslySetInnerHTML={{ __html: ticket.messages[ticket.messages.length - 1].content }} />
                    ) : (
                      'No messages'
                    )}</td> {/* Show last message content */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
