import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import useTickets from '../api/useTickets'; // Import the custom hook

const TicketsToHandle: React.FC = () => {
  const { tickets, users, loading } = useTickets(); // Use the custom hook

  const filteredTickets = tickets.filter(ticket => 
    ticket.status === 'NEW' && !ticket.assignedAgent
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tickets to Handle
      </Typography>
      {loading ? (
        <CircularProgress /> // Show a loading spinner while data is being fetched
      ) : (
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
                  <TableCell>{users[ticket.userId]?.name || 'Unknown'}</TableCell>
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
      )}
    </Box>
  );
};

export default TicketsToHandle;
