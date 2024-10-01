import { useEffect, useState } from 'react';
import {
  fetchTickets,
  fetchUserById,
  fetchAllAgents,
  updateTicket,
  fetchTicketsByUserId,
  addAgent,
  fetchTicketsByAgentId,
} from '../api/apiClient';
import { Ticket, User, DisplayAgent } from '../types/Ticket';
import { useAuth } from '../components/authContext';
 
const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [loading, setLoading] = useState(true);
  const [uniqueAgents, setUniqueAgents] = useState<{ agent: string; agentEmail: string }[]>([]);
  const [allAgents, setAllAgents] = useState<DisplayAgent[]>([]);
  const { userId: id, role: authRole } = useAuth();
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
 
  // Define fetchData function
  const fetchData = async () => {
    setLoading(true);
    try {
      let ticketData: Ticket[];
      if (userRole === 'admin') {
        ticketData = await fetchTickets();
    }else if (userRole === 'user' && id) {
      ticketData = await fetchTicketsByUserId(id);
    }else if(userRole == 'agent'){
      ticketData = await fetchTicketsByAgentId(id);
    }
     else {
      throw new Error('Invalid user role or missing user ID');
    }
    setTickets(ticketData);
 
      const userRequests = ticketData.map((ticket: Ticket) => fetchUserById(ticket.userId));
      const userData = await Promise.all(userRequests);
      const usersMap: { [key: number]: User } = {};
      userData.forEach((user: User) => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
 
      const agentsData = await fetchAllAgents();
      setAllAgents(agentsData);
 
      const uniqueAgentsSet = new Set<number>();
      const uniqueAgentsList: { agent: string; agentEmail: string }[] = [];
 
      for (const ticket of ticketData) {
        const agentId = ticket.assignedAgent;
        if (agentId && agentId !== 'unassigned' && !uniqueAgentsSet.has(Number(agentId))) {
          const agentData = agentsData.find((agent: DisplayAgent) => agent.id === Number(agentId));
          if (agentData) {
            uniqueAgentsList.push({
              agent: agentData.name,
              agentEmail: agentData.email,
            });
            uniqueAgentsSet.add(Number(agentId));
          }
        }
      }
      setUniqueAgents(uniqueAgentsList);
    } catch (error) {
      console.error('Error fetching tickets or users:', error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (authRole) {
      setUserRole(authRole);
    }
  }, [authRole]);
 
  useEffect(() => {
    if (userRole && id) {
      fetchData();
    }
  }, [userRole, id]);
 
  const handleUpdateTicket = async (id: string, updatedData: { status: string | null; priority: string | null; messages: any[] | null }) => {
    try {
      const updatedTicket = await updateTicket(id, updatedData);
      setTickets(prevTickets =>
        prevTickets.map(ticket => (ticket.id === id ? updatedTicket : ticket))
      );
 
      fetchData();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };
 
  const handleAssignAgent = async (ticketId: string, agentId: number) => {
    try {
      const updatedTicket = await addAgent(ticketId, agentId);
      const assignedAgentId = updatedTicket.assignedAgentId || updatedTicket.assignedAgent;
 
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, assignedAgent: assignedAgentId } : ticket
        )
      );
 
      fetchData();
    } catch (error) {
      console.error("Failed to assign agent:", error);
    }
  };
 
  return { tickets, users, uniqueAgents, allAgents, loading, userRole, handleUpdateTicket, handleAssignAgent };
};
 
export default useTickets;
 
 