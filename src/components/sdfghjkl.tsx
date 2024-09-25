import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SearchBar from './SearchBar';
import StatusDropdown from './StatusDropdown';
import PriorityDropdown from './PriorityDropdown';
import AgentDropdown from './AgentDropdown';
 
interface Ticket {
  id: number;
  requester: string;
  email: string;
  subject: string;
  agent: string;
  agentEmail: string;
  status: string;
  priority: string;
  lastMessage: string;
  createdDate: string;
}
 
interface SidebarProps {
  window?: () => Window;
}
 
const drawerWidth = 240;
 
// Styled components
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 'bold',
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderTop: `1px solid ${theme.palette.divider}`,
}));
 
const CustomTableCellStyle = styled(TableCell)(({ theme }) => ({
  padding: '8px 16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
 
const CheckboxCell = styled(TableCell)(({ theme }) => ({
  padding: '8px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderTop: `1px solid ${theme.palette.divider}`,
}));
 
const Logo = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginRight: 8,
}));
 
export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState('All Recent Tickets');
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [allAgents, setAllAgents] = React.useState<{ agent: string; agentEmail: string }[]>([]);
  const [selectedTickets, setSelectedTickets] = React.useState<Set<Ticket>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPriority, setSelectedPriority] = React.useState<string | null>(null); // Updated to null
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
 
  const navigate = useNavigate();
 
  React.useEffect(() => {
    axios.get('http://localhost:5001/tickets')
      .then(response => {
        setTickets(response.data);
 
        // Create a map to hold unique agents
        const uniqueAgentsMap: Record<string, string> = {};
       
        response.data.forEach((ticket: Ticket) => {
          if (ticket.agent !== 'unassigned') {
            uniqueAgentsMap[ticket.agent] = ticket.agentEmail;
          }
        });
 
        // Convert the map to an array of agent objects
        const uniqueAgents = Object.keys(uniqueAgentsMap).map(agent => ({
          agent,
          agentEmail: uniqueAgentsMap[agent],
        }));
       
        uniqueAgents.push({ agent: 'unassigned', agentEmail: '' });
 
        setAllAgents(uniqueAgents);
      })
      .catch(error => {
        console.error("There was an error fetching the tickets!", error);
      });
  }, []);
 
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
 
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
 
  const handleMenuClick = (text: string) => {
    setSelectedMenu(text);
    setSearchQuery('');
  };
 
  const handleCheckboxChange = (ticket: Ticket) => {
    setSelectedTickets(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(ticket)) {
        newSelected.delete(ticket);
      } else {
        newSelected.add(ticket);
      }
      return newSelected;
    });
  };
 
  const handleRequesterClick = (requester: string) => {
    if (requester) {
      navigate(`/requester/${encodeURIComponent(requester)}`);
    } else {
      console.error('Requester is undefined or invalid');
    }
  };
 
  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectedTickets(isChecked ? new Set(tickets) : new Set());
  };
 
  const filteredTickets = () => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
 
    return tickets.filter(ticket => {
      const matchesStatus = (() => {
        if (selectedMenu === 'Tickets To Handle') {
          return ticket.status === 'Open' && ticket.agent === 'unassigned';
        } else if (selectedMenu === 'My Open Tickets') {
          return ticket.status === 'Open';
        } else if (selectedMenu === 'My Tickets Last 7 Days') {
          const ticketDate = new Date(ticket.createdDate);
          return ticketDate >= sevenDaysAgo;
        } else if (['Open', 'Closed', 'InProgress', 'Solved'].includes(selectedMenu)) {
          return ticket.status === selectedMenu;
        }
        return true;
      })();
 
      const matchesSearch = searchQuery ? (
        ticket.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchQuery.toLowerCase())
      ) : true;
 
      return matchesStatus && matchesSearch;
    });
  };
 
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
 
  const getLogo = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
 
  const handleApplyChanges = () => {
    if (selectedTickets.size > 0) {
      const updatedTickets = tickets.map(ticket => {
        if (selectedTickets.has(ticket)) {
          return {
            ...ticket,
            status: selectedStatus || ticket.status,
            priority: selectedPriority || ticket.priority, // Use previous priority if none selected
            agent: selectedAgent !== null ? selectedAgent : ticket.agent,
            agentEmail: selectedAgent ? `${selectedAgent.toLowerCase()}@example.com` : ticket.agentEmail,
          };
        }
        return ticket;
      });
 
      setTickets(updatedTickets);
      setSelectedTickets(new Set());
      setSelectedStatus(null);
      setSelectedPriority(null); // Reset to null
      setSelectedAgent(null);
    }
  };
 
  const drawer = (
    <div>
      <Box sx={{ padding:2, marginTop:'-25px'}}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
          <Typography variant="h6">Tickets</Typography>
          <Button variant="contained" color="primary" onClick={() => handleMenuClick('All Recent Tickets')}>
            New Ticket
          </Button>
        </Box>
        <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      </Box>
      <Divider />
      <List>
        {['All Recent Tickets', 'Tickets To Handle', 'My Open Tickets', 'My Tickets Last 7 Days'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleMenuClick(text)} sx={{
              '&:hover': {
                color: 'blue', // Change text color on hover
              },
            }}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="h6" sx={{ padding: '4px 16px 0 16px', marginBottom: 0 ,marginTop: 2 }}>
      Statuses
      </Typography>
      <List>
        {['Open', 'InProgress', 'Solved', 'Closed'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleMenuClick(text)} sx={{
              '&:hover': {
                color: 'blue', // Change text color on hover
              },
            }}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
 
  const container = window !== undefined ? () => window().document.body : undefined;
 
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: 2
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mr: 2 }} noWrap component="div">
            Ticket Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          open
        >
          <Box sx={{ padding: 2 }}></Box>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Typography variant="h6" gutterBottom>
          {selectedMenu}
        </Typography>
        {selectedTickets.size > 0 && (
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <StatusDropdown
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
            <PriorityDropdown
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
            />
            <AgentDropdown
              agents={allAgents}
              selectedAgent={selectedAgent}
              onAgentChange={setSelectedAgent}
            />
            <Button variant="contained" color="primary" onClick={handleApplyChanges}>
              Apply
            </Button>
          </Box>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <CheckboxCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </CheckboxCell>
                <CustomTableCell>Requester</CustomTableCell>
                <CustomTableCell>Subject</CustomTableCell>
                <CustomTableCell>Agent</CustomTableCell>
                <CustomTableCell>Status</CustomTableCell>
                <CustomTableCell>Last Message</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets().map((ticket) => (
                <TableRow key={ticket.id}>
                  <CheckboxCell>
                    <Checkbox
                      checked={selectedTickets.has(ticket)}
                      onChange={() => handleCheckboxChange(ticket)}
                    />
                  </CheckboxCell>
                  <CustomTableCellStyle onClick={() => handleRequesterClick(ticket.requester)}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Logo>{getLogo(ticket.requester)}</Logo>
                      <div>
                        <Typography variant="body2">{ticket.requester}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {ticket.email}
                        </Typography>
                      </div>
                    </Box>
                  </CustomTableCellStyle>
                  <CustomTableCellStyle>{ticket.subject}</CustomTableCellStyle>
                  <CustomTableCellStyle>{ticket.agent}</CustomTableCellStyle>
                  <CustomTableCellStyle>{ticket.status}</CustomTableCellStyle>
                  <CustomTableCellStyle>{ticket.lastMessage}</CustomTableCellStyle>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
 
Sidebar.propTypes = {
  window: PropTypes.func,
};
 
export default Sidebar;
 
 