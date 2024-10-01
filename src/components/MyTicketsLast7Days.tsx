import React from 'react';
import { Box, Typography, List, ListItem, CircularProgress } from '@mui/material';
import useTickets from '../api/useTickets';
 
const MyTicketsLast7Days: React.FC = () => {
  const { tickets, loading } = useTickets();
 
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
 
 
  const recentTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    return ticketDate >= sevenDaysAgo;
  });
 
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Tickets Last 7 Days
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {recentTickets.map(ticket => (
            <ListItem key={ticket.id}>
              {ticket.subject}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
 
export default MyTicketsLast7Days;
 
 