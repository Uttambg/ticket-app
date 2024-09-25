import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Ticket } from '../types/Ticket';
import { User } from '../types/Ticket';
import { fetchTickets, fetchUserById } from '../api/apiClient'; // Importing the API client
import useTickets from '../api/useTickets';

const InProgress: React.FC = () => {
  const { tickets, users, loading } = useTickets(); // Use the custom hook


  const filteredTickets = tickets.filter(ticket => ticket.status === 'Pending');

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pending Tickets
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Requester</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{users[ticket.userId]?.name || 'Loading...'}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.assignedAgent || 'Unassigned'}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>  {ticket.messages.length > 0 ? (
                      <span dangerouslySetInnerHTML={{ __html: ticket.messages[ticket.messages.length - 1].content }} />
                    ) : (
                      'No messages'
                    )}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InProgress;
