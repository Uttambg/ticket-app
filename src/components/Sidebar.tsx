import * as React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import SearchBar from "./SearchBar";
import StatusDropdown from "./StatusDropdown";
import PriorityDropdown from "./PriorityDropdown";
import AgentDropdown from "./AgentDropdown";
import useTickets from "../api/useTickets"; // Ensure the path is correct
import { Ticket, User } from "../types/Ticket";
 
interface SidebarProps {
  window?: () => Window;
}
 
const drawerWidth = 240;
 
// Styled components
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: "bold",
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderTop: `1px solid ${theme.palette.divider}`,
}));
 
const CustomTableCellStyle = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
 
const CheckboxCell = styled(TableCell)(({ theme }) => ({
  padding: "8px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderTop: `1px solid ${theme.palette.divider}`,
}));
 
const Logo = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginRight: 8,
}));
 
export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState("All Recent Tickets");
  const [selectedTickets, setSelectedTickets] = React.useState<Set<Ticket>>(
    new Set()
  );
  const [selectAll, setSelectAll] = React.useState(false);
 
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPriority, setSelectedPriority] = React.useState<string | null>(
    null
  );
  const [selectedAgent, setSelectedAgent] = React.useState<number | null>(null);
  const [agentId, setAgentId] = React.useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
    null
  );
  const [showDropdowns, setShowDropdowns] = React.useState(false);
 
  const navigate = useNavigate();
  const { tickets, users, uniqueAgents, loading,userRole,allAgents, handleUpdateTicket ,handleAssignAgent} =
    useTickets();
 
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
 
  const extractPlainText = (htmlContent: string) => {
    // Create a temporary DOM element to use the browser's HTML parser
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent; // Set the inner HTML
    return tempDiv.innerText; // Return the plain text
  };
 
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
 
  const handleMenuClick = (text: string) => {
    if (text === "New Ticket") {
      navigate("/new-ticket"); // Navigate to the new ticket page
    } else {
      setSelectedMenu(text);
      setSearchQuery("");
    }
  };
 
  const handleCheckboxChange = (ticket: Ticket) => {
    setSelectedTickets((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(ticket)) {
        newSelected.delete(ticket);
      } else {
        newSelected.add(ticket);
      }
      setShowDropdowns(newSelected.size > 0); // Show dropdowns if any ticket is selected
      return newSelected;
    });
  };
 
  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectedTickets(isChecked ? new Set(tickets) : new Set());
    setShowDropdowns(isChecked); // Show dropdowns if all tickets are selected
  };
 
 
  const filteredTickets = () => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
 
    return tickets.filter((ticket) => {
      const matchesStatus = (() => {
        if (selectedMenu === "Tickets To Handle") {
          return (
            ticket.status.toLowerCase() === "new" &&
            (ticket.assignedAgent || "unassigned").toLowerCase() ===
            "unassigned"
          );
        } else if (selectedMenu === "My New Tickets") {
          return ticket.status.toLowerCase() === "NEW";
        } else if (selectedMenu === "My Tickets Last 7 Days") {
          const ticketDate = new Date(ticket.createdAt);
          return ticketDate >= sevenDaysAgo;
        } else if (
          ["New", "Closed", "InProgress", "Solved"].includes(selectedMenu)
        ) {
          return ticket.status.toLowerCase() === selectedMenu.toLowerCase();
        }
        return true;
      })();
 
      const matchesSearch = searchQuery
        ? (users[ticket.userId]?.name || "Unknown")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.assignedAgent || "Unassigned")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (ticket.messages.length > 0
          ? ticket.messages[ticket.messages.length - 1].content
          : "No messages"
        )
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
 
      return matchesStatus && matchesSearch;
    });
  };
 
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
 
  const getLogo = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
 
  const handleRequesterClick = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`); // Navigate to the ticket details page using ID
  };
 
  const handleApplyChanges = () => {
    if (selectedTickets.size > 0) {
      selectedTickets.forEach((ticket) => {
        const updatedData = {
          status: selectedStatus || ticket.status,
          priority: selectedPriority || ticket.priority,
          messages: null,
        };
 
        handleUpdateTicket(ticket.id, updatedData);
 
        if (selectedAgent !== null) { // Use selectedAgent instead of agentId
          handleAssignAgent(ticket.id, selectedAgent);
        }
      });
 
      // Clear selections and reset states
      setSelectedTickets(new Set());
      setSelectedStatus(null);
      setSelectedPriority(null);
      setSelectedAgent(null); // Reset the selected agent
      setShowDropdowns(false);
    }
  };
 
 
 
  const drawer = (
    <div>
      <Box className="sidebar-header" sx={{ padding: 2, marginTop: "-10px" }}>
        <Box
          className="sidebar-header-content"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 1,
          }}
        >
          <Typography variant="h6">Tickets</Typography>
          {userRole === 'user' && ( // Show "New Ticket" button only for user
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleMenuClick("New Ticket")}
            >
              New Ticket
            </Button>
          )}
        </Box>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Box>
      <Divider />
      <List className="sidebar-menu">
      {userRole === 'admin' ? (
          // Admin view
          ["All Recent Tickets",  "Tickets To Handle"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(text)}
                sx={{
                  "&:hover": {
                    color: "blue",
                  },
                }}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          // User view
          ["All Recent Tickets","My New Tickets", "My Tickets Last 7 Days"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(text)}
                sx={{
                  "&:hover": {
                    color: "blue",
                  },
                }}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
      <Divider />
      <Typography
        variant="h6"
        sx={{ padding: "4px 16px 0 16px", marginBottom: 0, marginTop: 2 }}
        className="sidebar-status-header"
      >
        Statuses
      </Typography>
      <List className="sidebar-status-menu">
        {["New", "InProgress", "Solved", "Closed"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(text)}
              sx={{
                "&:hover": {
                  color: "blue",
                },
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
 
  const container =
    window !== undefined ? () => window().document.body : undefined;
 
  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }
 
  // Enable the Apply button if any dropdown has a selected value
  const isApplyEnabled =
    selectedTickets.size > 0 &&
    (selectedPriority !== null ||
      selectedAgent !== null ||
      selectedStatus !== null);
 
  return (
    // <div>
    <Box sx={{ display: "flex", width: "100%" }}>
 
 
 
 
 
<AppBar
  sx={{
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'transparent', // Set AppBar background to transparent
  }}
>
  <Toolbar
    sx={{
      display: 'flex',
      justifyContent: 'space-between', // Space between items
      position: 'relative', // To position the Typography correctly
      marginLeft: '80px', // Add left margin to the Toolbar
      width: 'calc(100% - 80px)', // Adjust width to account for the margin
      backgroundColor: '#1271a9', // Set Toolbar background to blue
    }}
  >
    <Box sx={{ width: '56px', backgroundColor: 'transparent' }} /> {/* Transparent margin area */}
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{
        flexGrow: 1,
        textAlign: 'center', // Center the text
        color: 'white', // Set text color to white for visibility
      }}
    >
      Ticket Management
    </Typography>
  </Toolbar>
</AppBar>
 
 
 
 
 
      <Box
        className="sidebar-nav"
        component="nav"
        sx={{
          width: { sm: drawerWidth }, // Define the width of the drawer
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth, // Ensure the drawer's paper has the same width
            },
          }}
        >
          {drawer}
        </Drawer>
 
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth, // Ensure the drawer's paper has the same width
              boxSizing: 'border-box',
              marginLeft: '80px', // Add margin here if needed, but adjust as necessary
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
 
      {/* <Box
        className="sidebar-main"
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      > */}
 
      <Box
        className="sidebar-main"
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Typography variant="h6" gutterBottom>
          {selectedMenu}
        </Typography>
 
        {/* Dropdowns and Apply button section */}
        {showDropdowns && (
          <Box
            className="sidebar-dropdowns"
            sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
          >
            <StatusDropdown
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
            <PriorityDropdown
              selectedPriority={selectedPriority}
              onPriorityChange={(priority) => {
                setSelectedPriority(priority);
              }}
            />
           
           
<AgentDropdown
  selectedAgent={selectedAgent} // Correctly reflect the selected agent
  onAgentChange={(id) => {
    console.log('Selected agent ID:', id); // Debug log
    setSelectedAgent(id); // Update state on selection
  }}
  allAgents={allAgents} // Pass the fetched agents
  loading={loading} // Pass the loading state
/>
 
 
 
            <Button variant="contained" onClick={handleApplyChanges}>
              Apply
            </Button>
          </Box>
        )}
 
        <TableContainer
          className="sidebar-table-container"
          component={Paper}
          sx={{ marginLeft: "0" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {userRole !=='user'&& (
                <CheckboxCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </CheckboxCell>
                )}
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
                  {userRole !=='user'&& (
                  <CheckboxCell>
                    <Checkbox
                      checked={selectedTickets.has(ticket)}
                      onChange={() => handleCheckboxChange(ticket)}
                    />
                  </CheckboxCell>
                  )}
                  <CustomTableCellStyle
                    onClick={() =>
                      handleRequesterClick(
                      ticket.id
                      )
                    }
                  >
                    <Box
                      className="ticket-requester"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Logo>{getLogo(users[ticket.userId]?.name || "")}</Logo>
                      <div>
                        <Typography variant="body2">
                          {users[ticket.userId]?.name || "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {users[ticket.userId]?.email || "No Email"}
                        </Typography>
                      </div>
                    </Box>
                  </CustomTableCellStyle>
                  <CustomTableCell>{ticket.subject}</CustomTableCell>
                  <CustomTableCell>
                    {ticket.assignedAgent || "Unassigned"}
                  </CustomTableCell>
                  <CustomTableCellStyle>{ticket.status}</CustomTableCellStyle>
                  <CustomTableCell>
                  {ticket.messages.length > 0 ? (
                      <span>
                        {extractPlainText(ticket.messages[ticket.messages.length - 1].content)}
                      </span>
                    ) : (
                      'No messages'
                    )}
                  </CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
    // </div>
  );
};
 
Sidebar.propTypes = {
  window: PropTypes.func,
};
 
export default Sidebar;
 
 