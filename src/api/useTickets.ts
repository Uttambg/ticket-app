// import { useEffect, useState } from 'react';
// import { fetchTickets, fetchUserById, fetchAllAgents, fetchAgentById, updateTicket, fetchTicketsByUserId } from '../api/apiClient';
// import { Ticket, User, DisplayAgent } from '../types/Ticket';
// import { useAuth } from '../components/authContext';

// const useTickets = () => {
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [users, setUsers] = useState<{ [key: number]: User }>({});
//   const [loading, setLoading] = useState(true);
//   const [uniqueAgents, setUniqueAgents] = useState<{ agent: string; agentEmail: string }[]>([]); // Change this to match your dropdown structure
//   const [allAgents, setAllAgents] = useState<DisplayAgent[]>([]);
//   const{userId: id}=useAuth();
//   const { role: authRole } = useAuth();
//   const [userRole, setUserRole] = useState<string | undefined>(undefined);
//   const [userId, setUserId] = useState<number | undefined>(undefined);

//   useEffect(() => {
//     if (authRole) {
//       setUserRole(authRole);
//     }
//     if (id) {
//       setUserId(id);
//     }
//   }, [authRole, id]);


//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true); // Start loading
//       try {

//         let ticketData: Ticket[];
//         if (userRole === 'admin') {
//           ticketData = await fetchTickets();
//         } else if (userRole === 'user' && userId) {
//           ticketData = await fetchTicketsByUserId(userId);
//         } else {
//           throw new Error('Invalid user role or missing user ID');
//         }
//         setTickets(ticketData);

//         const userRequests = ticketData.map((ticket: Ticket) => fetchUserById(ticket.userId));
//         const userData = await Promise.all(userRequests);

//         // Map users by ID
//         const usersMap: { [key: number]: User } = {};
//         userData.forEach((user: User) => {
//           usersMap[user.id] = user;
//         });
//         setUsers(usersMap);

//         // Create an array to hold unique agents
//         const uniqueAgentsSet = new Set<number>(); // To track unique agent IDs
//         const uniqueAgentsList: { agent: string; agentEmail: string }[] = []; // Array to hold unique agents

//         for (const ticket of ticketData) {
//           if (ticket.assignedAgent && ticket.assignedAgent !== 'unassigned') {
//             const agentId = ticket.assignedAgent; // Assuming assignedAgent is the agent ID
//             if (!uniqueAgentsSet.has(Number(agentId))) {
//               const agentData = await fetchAgentById(Number(agentId));
//               uniqueAgentsList.push({
//                 agent: agentData.name,
//                 agentEmail: agentData.email,
//               });
//               uniqueAgentsSet.add(Number(agentId));
//             }
//           }
//         }
//         setUniqueAgents(uniqueAgentsList); // Set unique agents as an array

//         // Fetch all agents
//         const agentsData = await fetchAllAgents();
//         setAllAgents(agentsData);
//       } catch (error) {
//         console.error('Error fetching tickets or users:', error);
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };

//     fetchData();
//   }, [userRole,userId]);

//   const handleUpdateTicket = async (id: string, updatedData: { status: string | null; priority: string | null; messages: any[] | null }) => {
//     try {
//       const updatedTicket = await updateTicket(id, updatedData); // Send PUT request
//       setTickets(prevTickets =>
//         prevTickets.map(ticket => (ticket.id === id ? updatedTicket : ticket))
//       );
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//     }
//   };

//   return { tickets, users, uniqueAgents, allAgents, loading,userRole, handleUpdateTicket };
// };

// export default useTickets;




import { useEffect, useState } from 'react';
import { fetchTickets, fetchUserById, fetchAllAgents, updateTicket, fetchTicketsByUserId, addAgent } from '../api/apiClient';
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
 
  useEffect(() => {
    if (authRole) {
      setUserRole(authRole);
    }
  }, [authRole]);
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let ticketData: Ticket[];
        if (userRole === 'admin') {
          ticketData = await fetchTickets();
        } else if (userRole === 'user' && id) {
          ticketData = await fetchTicketsByUserId(id);
        } else {
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
 
        // Fetch all agents once
        const agentsData = await fetchAllAgents();
        setAllAgents(agentsData);
 
        // Extract unique agents from tickets
        const uniqueAgentsSet = new Set<number>();
        const uniqueAgentsList: { agent: string; agentEmail: string }[] = [];
 
for (const ticket of ticketData) {
  const agentId = ticket.assignedAgent;
  if (agentId && agentId !== 'unassigned' && !uniqueAgentsSet.has(Number(agentId))) {
    // Specify the type of agent in the find callback
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
 
    fetchData();
  }, [userRole, id]);
 
  const handleUpdateTicket = async (id: string, updatedData: { status: string | null; priority: string | null; messages: any[] | null }) => {
    try {
      const updatedTicket = await updateTicket(id, updatedData);
      setTickets(prevTickets =>
        prevTickets.map(ticket => (ticket.id === id ? updatedTicket : ticket))
      );
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
    } catch (error) {
      console.error("Failed to assign agent:", error);
    }
  };
 
  return { tickets, users, uniqueAgents, allAgents, loading, userRole, handleUpdateTicket, handleAssignAgent };
};
 
export default useTickets;
 
 