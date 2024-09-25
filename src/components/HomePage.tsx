import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { fetchTickets, fetchUserById } from '../api/apiClient'; // Import the API functions
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { Ticket } from '../types/Ticket'; // Ensure this import exists

const HomePage: React.FC = () => {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [users, setUsers] = React.useState<{ [key: number]: any }>({});
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const allTickets = await fetchTickets();
        setTickets(allTickets);

        // Fetch users for each ticket
        const userPromises = allTickets.map((ticket: Ticket) => fetchUserById(ticket.userId)); // Explicitly type ticket
        const userResults = await Promise.all(userPromises);
        
        // Map users by their IDs
        const usersMap: { [key: number]: any } = {};
        userResults.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />; // Show a loading spinner while data is being fetched
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/new-ticket">
        Create New Ticket
      </Button>
      <Typography variant="h6" gutterBottom>
        Recent Tickets
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
            {tickets.slice(0, 5).map((ticket: Ticket) => ( // Ensure ticket is typed
              <TableRow key={ticket.id}>
                <TableCell>{users[ticket.userId]?.name || 'Unknown'}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.assignedAgent || 'Unassigned'}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.messages.length > 0 ? ticket.messages[ticket.messages.length - 1].content : 'No messages'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HomePage;
