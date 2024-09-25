import React from 'react';
import { Box, Typography, List, ListItem, CircularProgress } from '@mui/material';
import useTickets from '../api/useTickets'; // Import the custom hook

const MyTicketsLast7Days: React.FC = () => {
  const { tickets, loading } = useTickets(); // Use the custom hook

  // Get the current date and the date 7 days ago
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Filter tickets to only include those created in the last 7 days
  const recentTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt); // Assuming createdAt is the field for created date
    return ticketDate >= sevenDaysAgo;
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Tickets Last 7 Days
      </Typography>
      {loading ? (
        <CircularProgress /> // Show a loading spinner while data is being fetched
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
