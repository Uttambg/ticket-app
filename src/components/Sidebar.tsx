import * as React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
import useTickets from "../api/useTickets";
import { Ticket, User } from "../types/Ticket";
 
interface SidebarProps {
  window?: () => Window;
}
 
const drawerWidth = 240;
 
 
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
  const { tickets, users, uniqueAgents, loading, userRole, allAgents, handleUpdateTicket, handleAssignAgent } =
    useTickets();
 
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
 
  const extractPlainText = (htmlContent: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.innerText;
  };
 
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
 
  const handleMenuClick = (text: string) => {
    if (text === "New Ticket") {
      navigate("/new-ticket");
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
      setShowDropdowns(newSelected.size > 0);
      return newSelected;
    });
  };
 
  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectedTickets(isChecked ? new Set(tickets) : new Set());
    setShowDropdowns(isChecked);
  };
 
 
  const filteredTickets = () => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
 
    const safeParseDate = (dateString:string) :Date => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date(0) : date;
    };
 
    const sortedTickets = [...tickets].sort((a, b) => {
        const aDate = safeParseDate(a.createdAt);
        const bDate = safeParseDate(b.createdAt);
        return bDate.getTime() - aDate.getTime();
    });
 
    return sortedTickets.filter((ticket) => {
        const matchesStatus = (() => {
            if (selectedMenu === "Tickets To Handle") {
                return (
                    ticket.status.toLowerCase() === "new" &&
                    (ticket.assignedAgent || "unassigned").toLowerCase() ===
                    "unassigned"
                );
            } else if (selectedMenu === "My New Tickets") {
                return ticket.status.toLowerCase() === "new";
            } else if (selectedMenu === "My Tickets Last 7 Days") {
                const ticketDate = safeParseDate(ticket.createdAt);
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
  const countTickets = (filterFn: (ticket: Ticket) => boolean): number => {
    return tickets.filter(filterFn).length;
  };
 
  const getLogo = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
 
  const handleRequesterClick = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
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
 
        if (selectedAgent !== null) {
          handleAssignAgent(ticket.id, selectedAgent);
        }
      });
 
     
      setSelectedTickets(new Set());
      setSelectedStatus(null);
      setSelectedPriority(null);
      setSelectedAgent(null);
      setShowDropdowns(false);
    }
  };
 
  const drawer = (
    <Box sx={{ width: "100%" }}>
     
      <Box
        className="sidebar-header"
        sx={{
          padding: 2,
          marginTop: "-10px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          className="sidebar-header-content"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#333" }}
          >
            Tickets
          </Typography>
          {userRole === "user" && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1261a9",
                  boxShadow: "none",
                },
              }}
              onClick={() => handleMenuClick("New Ticket")}
            >
              New Ticket
            </Button>
          )}
        </Box>
      </Box>
 
     
      <Divider />
 
     
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          padding: "0 10px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
          margin: "8px 0",
        }}
      >
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </Box>
 
   
     <List className="sidebar-menu" sx={{ padding: "8px 0" }}>
  {userRole === 'admin' ? (
 
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick("All Recent Tickets")}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText primary="All Recent Tickets" />
          <Typography variant="body2" color="text.secondary">
            {countTickets(() => true)}
          </Typography>
        </ListItemButton>
      </ListItem>
     
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick("Tickets To Handle")}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText primary="Tickets To Handle" />
          <Typography variant="body2" color="text.secondary">
            {countTickets(ticket =>
              ticket.status.toLowerCase() === "new" &&
              (ticket.assignedAgent || "unassigned").toLowerCase() === "unassigned"
            )}
          </Typography>
        </ListItemButton>
      </ListItem>
    </>
  ) : userRole === 'agent' ? (
   
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick("All Recent Tickets")}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText primary="All Recent Tickets" />
          <Typography variant="body2" color="text.secondary">
            {countTickets(() => true)}
          </Typography>
        </ListItemButton>
      </ListItem>
 
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick("Tickets To Handle")}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText primary="Tickets To Handle" />
          <Typography variant="body2" color="text.secondary">
            {countTickets(ticket =>
              ticket.status.toLowerCase() === "new" &&
              (ticket.assignedAgent || "unassigned").toLowerCase() === "unassigned"
            )}
          </Typography>
        </ListItemButton>
      </ListItem>
    </>
  ) : (
   
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick("All Recent Tickets")}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText primary="All Recent Tickets" />
          <Typography variant="body2" color="text.secondary">
            {countTickets(() => true)}
          </Typography>
        </ListItemButton>
      </ListItem>
     
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick("My New Tickets")}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText primary="My New Tickets" />
          <Typography variant="body2" color="text.secondary">
            {countTickets(ticket => ticket.status.toLowerCase() === "new")}
          </Typography>
        </ListItemButton>
      </ListItem>
 
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick("My Tickets Last 7 Days")}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText primary="My Tickets Last 7 Days" />
          <Typography variant="body2" color="text.secondary">
            {countTickets(ticket => {
              const now = new Date();
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(now.getDate() - 7);
              return new Date(ticket.createdAt) >= sevenDaysAgo;
            })}
          </Typography>
        </ListItemButton>
      </ListItem>
    </>
  )}
</List>
 
<Divider />
 
 
<Typography
  variant="h6"
  sx={{
    padding: "4px 16px",
    marginBottom: "0",
    marginTop: 2,
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#444",
  }}
  className="sidebar-status-header"
>
  Statuses
</Typography>
 
<List className="sidebar-status-menu" sx={{ padding: "8px 0" }}>
  {userRole === 'agent' ? (
   
    ["InProgress", "Solved"].map((text) => (
      <ListItem key={text} disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick(text)}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText
            primary={text}
            primaryTypographyProps={{ fontWeight: "medium" }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
            {countTickets(ticket => ticket.status.toLowerCase() === text.toLowerCase())}
          </Typography>
        </ListItemButton>
      </ListItem>
    ))
  ) : (
   
    ["New", "InProgress", "Solved", "Closed"].map((text) => (
      <ListItem key={text} disablePadding>
        <ListItemButton
          onClick={() => handleMenuClick(text)}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "white",
              backgroundColor: "#1261a9",
            },
          }}
        >
          <ListItemText
            primary={text}
            primaryTypographyProps={{ fontWeight: "medium" }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
            {countTickets(ticket => ticket.status.toLowerCase() === text.toLowerCase())}
          </Typography>
        </ListItemButton>
      </ListItem>
    ))
  )}
</List>
 
    </Box>
  );
 
  const container =
    window !== undefined ? () => window().document.body : undefined;
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
 
  const isApplyEnabled =
    selectedTickets.size > 0 &&
    (selectedPriority !== null ||
      selectedAgent !== null ||
      selectedStatus !== null);
 
  return (
   
    <Box sx={{ display: "flex", width: "100%" }}>
      <AppBar
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: 'transparent',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            marginLeft: '80px',
            width: 'calc(100% - 80px)',
            backgroundColor: '#1271a9',
          }}
        >
        <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  }}
>
  <Box sx={{ width: '56px', backgroundColor: 'transparent' }} />
  <Typography
    variant="h6"
    noWrap
    component="div"
    sx={{
      flexGrow: 1,
      textAlign: 'center',
      color: 'white',
      paddingLeft: '19%',
      opacity: 0,
      transform: 'translateX(-100%)',
      animation: 'slideIn 1s forwards',
      fontSize: '1.2rem',
      transition: 'font-size 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out', // Smooth transition for hover effect
      '@keyframes slideIn': {
        '0%': {
          opacity: 0,
          transform: 'translateX(-100%)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateX(0)',
        },
      },
      '&:hover': {
        fontSize: '1.8rem',
        transform: 'translateX(0)',
        cursor: 'pointer',
      },
    }}
  >
    Ticket Management
  </Typography>
</Box>
 
 
        </Toolbar>
      </AppBar>
 
      <Box
        className="sidebar-nav"
        component="nav"
        sx={{
          width: { sm: drawerWidth },
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
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
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
              width: drawerWidth,
              boxSizing: 'border-box',
              marginLeft: '80px',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
 
      <Box
  className="sidebar-main"
  component="main"
  sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
>
  <Toolbar />
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
    {selectedMenu}
  </Typography>
 
 
  {showDropdowns && (
    <Box
      className="sidebar-dropdowns"
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 3,
        gap: 2,
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1), 0 -4px 10px rgba(255, 255, 255, 0.5)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(145deg, #f0f4f8, #d0d0d0)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15), 0 -6px 15px rgba(255, 255, 255, 0.6)',
        },
      }}
    >
     
      {userRole === 'agent' ? (
        <Box
          sx={{
            flex: 1,
            '& .MuiSelect-root': {
              borderRadius: '12px',
              backgroundColor: '#f7f9fc',
              border: '1px solid #b0c4de',
              transition: 'border 0.3s ease, background-color 0.3s ease',
              '&:focus, &:hover': {
                border: '2px solid #1976d2',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 15px rgba(25, 118, 210, 0.3)',
              },
              '& fieldset': {
                display: 'none',
              },
              '& .MuiSelect-select': {
                padding: '14px 24px',
                fontWeight: '500',
                fontSize: '16px',
              },
            },
          }}
        >
          <StatusDropdown
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            role="agent"
          />
        </Box>
      ) : (
       
        <>
          {['StatusDropdown', 'PriorityDropdown', 'AgentDropdown'].map((Dropdown, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                '& .MuiSelect-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f7f9fc',
                  border: '1px solid #b0c4de',
                  transition: 'border 0.3s ease, background-color 0.3s ease',
                  '&:focus, &:hover': {
                    border: '2px solid #1976d2',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 15px rgba(25, 118, 210, 0.3)',
                  },
                  '& fieldset': {
                    display: 'none',
                  },
                  '& .MuiSelect-select': {
                    padding: '14px 24px',
                    fontWeight: '500',
                    fontSize: '16px',
                  },
                },
              }}
            >
              {Dropdown === 'StatusDropdown' && (
                <StatusDropdown
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  role="admin"
                />
              )}
              {Dropdown === 'PriorityDropdown' && (
                <PriorityDropdown
                  selectedPriority={selectedPriority}
                  onPriorityChange={(priority) => {
                    setSelectedPriority(priority);
                  }}
                />
              )}
              {Dropdown === 'AgentDropdown' && (
                <AgentDropdown
                  selectedAgent={selectedAgent}
                  onAgentChange={(id) => {
                    console.log('Selected agent ID:', id);
                    setSelectedAgent(id);
                  }}
                  allAgents={allAgents}
                  loading={loading}
                />
              )}
            </Box>
          ))}
        </>
      )}
 
      <Button
        variant="contained"
        onClick={handleApplyChanges}
        sx={{
          backgroundColor: '#1976d2',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '12px 28px',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
          transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
          '&:hover': {
            backgroundColor: '#0d47a1',
            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.5)',
            transform: 'translateY(-3px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          },
        }}
      >
        Apply
      </Button>
    </Box>
)}
 
 
 
  <TableContainer
    className="sidebar-table-container"
    component={Paper}
    sx={{ marginLeft: "0", borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }} // Rounded corners and shadow
  >
    <Table>
 
 
 
    <TableHead>
  <TableRow>
    {userRole !== 'user' && (
      <CheckboxCell padding="checkbox">
        <Checkbox
          checked={selectAll}
          onChange={handleSelectAllChange}
          sx={{
            color: '#1976d2',
            '&.Mui-checked': {
              color: '#1976d2',
            },
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        />
      </CheckboxCell>
    )}
    <CustomTableCell sx={{
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: '#f7f9fc',
      padding: '12px 16px',
      borderBottom: '2px solid #d0d0d0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    }}>
      Requester
    </CustomTableCell>
    <CustomTableCell sx={{
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: '#f7f9fc',
      padding: '12px 16px',
      borderBottom: '2px solid #d0d0d0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    }}>
      Subject
    </CustomTableCell>
    <CustomTableCell sx={{
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: '#f7f9fc',
      padding: '12px 16px',
      borderBottom: '2px solid #d0d0d0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    }}>
      Agent
    </CustomTableCell>
    <CustomTableCell sx={{
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: '#f7f9fc',
      padding: '12px 16px',
      borderBottom: '2px solid #d0d0d0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    }}>
      Status
    </CustomTableCell>
    <CustomTableCell sx={{
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: '#f7f9fc',
      padding: '12px 16px',
      borderBottom: '2px solid #d0d0d0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    }}>
      Last Message
    </CustomTableCell>
  </TableRow>
 
</TableHead>
 
      <TableBody>
  {filteredTickets().map((ticket) => (
   
   <TableRow key={ticket.id}
      sx={{
        '&:hover': {
          backgroundColor: '#e6f0ff',
          cursor: 'pointer',
          transform: 'scale(1.02)',
          transition: 'background-color 0.3s, transform 0.2s',
        },
      }}
    >
     { userRole !== 'user'&&<CheckboxCell>
        <Checkbox
          checked={selectedTickets.has(ticket)}
          onChange={(e) => {
            e.stopPropagation();
            handleCheckboxChange(ticket);
          }}
        />
      </CheckboxCell>}
     
      <CustomTableCellStyle
        sx={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => handleRequesterClick(ticket.id)}
      >
        <Box className="ticket-requester" sx={{ display: "flex", alignItems: "center" }}>
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
 
      <CustomTableCell onClick={() => handleRequesterClick(ticket.id)}>{ticket.subject}</CustomTableCell>
      <CustomTableCell onClick={() => handleRequesterClick(ticket.id)}>
        {ticket.assignedAgent || "Unassigned"}
      </CustomTableCell>
      <CustomTableCellStyle onClick={() => handleRequesterClick(ticket.id)}>{ticket.status}</CustomTableCellStyle>
      <CustomTableCell onClick={() => handleRequesterClick(ticket.id)}>
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
   
  );
};
 
Sidebar.propTypes = {
  window: PropTypes.func,
};
 
export default Sidebar;
 
 
 
 