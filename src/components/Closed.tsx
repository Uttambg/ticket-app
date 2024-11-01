import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Ticket, User } from '../types/Ticket';
import axios from 'axios';
import useTickets from '../api/useTickets';
 
const Closed: React.FC = () => {
  const { tickets, users, loading } = useTickets();
 
 
  const filteredTickets = tickets.filter(ticket => ticket.status === 'Closed');
 
 
  const getLastMessageContent = (messages: Ticket['messages']) => {
    if (messages && messages.length > 0) {
      return messages[messages.length - 1].content;
    }
    return 'No messages';
  };
 
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Closed Tickets
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Requester</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map(ticket => {
              const user = users[ticket.userId];
              return (
                <TableRow key={ticket.id}>
                  <TableCell>{user ? user.name : 'Loading...'}</TableCell>
                  <TableCell>{user ? user.email : 'Loading...'}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.assignedAgent || 'Unassigned'}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>  {ticket.messages.length > 0 ? (
                      <span dangerouslySetInnerHTML={{ __html: ticket.messages[ticket.messages.length - 1].content }} />
                    ) : (
                      'No messages'
                    )}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
 
export default Closed;
 
 