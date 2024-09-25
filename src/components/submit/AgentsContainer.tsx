import React, { useState, useEffect } from 'react';
import AgentRow from './AgentRow';
import Modal from './Modal';
import { fetchAllAgents } from '../../api/apiClient';
import { DisplayAgent } from '../../types/Ticket'; // Assuming DisplayAgent is in the Ticket file
 
interface AgentWithColor extends DisplayAgent {
  iconColor: string; // Add iconColor to local agent type
}
 
interface AgentsContainerProps {
  setSelectedAgent: (agent: DisplayAgent) => void;
}
 
// Function to generate a random color
const generateRandomColor = () => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};
 
export const AgentsContainer: React.FC<AgentsContainerProps> = ({ setSelectedAgent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({ key: '', direction: 'ascending' });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<AgentWithColor[]>([]); // Use the local type that includes iconColor
 
  // Fetch agents from backend when component mounts
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentsData: DisplayAgent[] = await fetchAllAgents(); // Fetch agents from backend
        console.log('Fetched agents data:', agentsData); // Log the fetched data for debugging
 
        // Check if the response is an array
        if (Array.isArray(agentsData)) {
          const agentsWithColors = agentsData.map((agent) => ({
            ...agent,
            iconColor: generateRandomColor(), // Assign random colors
          }));
          setAgents(agentsWithColors);
        } else {
          console.error('Expected an array but got:', agentsData); // Log unexpected format
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error); // Log the error
      }
    };
    loadAgents();
  }, []);
 
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
 
  // Sorting function
  const sortAgents = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
 
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
 
    if (sortConfig.key !== key) {
      direction = 'ascending';
    }
 
    const sortedAgents = [...agents].sort((a, b) => {
      if (key === 'name') {
        return direction === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (key === 'role') {
        const roleA = a.role === 'Admin' ? 'Admin' : 'Agent';
        const roleB = b.role === 'Admin' ? 'Admin' : 'Agent';
        return direction === 'ascending' ? roleA.localeCompare(roleB) : roleB.localeCompare(roleA);
      } else if (key === 'autoAssigned') {
        return direction === 'ascending' ? (a.autoAssigned ? -1 : 1) : (a.autoAssigned ? 1 : -1);
      }
      return 0;
    });
 
    setAgents(sortedAgents);
    setSortConfig({ key, direction });
  };
 
  const handleRowClick = (index: number, agent: DisplayAgent) => {
    setSelectedAgentIndex(index);
    setSelectedAgent(agent);
  };
 
  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <div className="bg-white flex flex-col ml-[5px] mt-[0px] rounded-lg h-[95vh] pb-[20px] border border-gray-300">
      <div className="bg-white border-b border-gray-300 rounded-t-lg flex flex-col">
        <div className="flex justify-between w-full h-[50px] items-center border-b border-gray-300">
          <div className="w-1/4 flex h-full items-center pl-[10px]">
            <button className="px-[12px] py-[1px] transition-all mx-[8px] border-b-4 border-blue-500">
              Agents ({agents.length})
            </button>
          </div>
 
          <div className="w-3/4 flex justify-end pr-[10px] space-x-4">
            {isSearchActive ? (
              <div className="relative w-1/2">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring bg-white"
                  placeholder="Find agent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderWidth: '1px', borderColor: '#1A73E8' }}
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery('');
                  }}
                  style={{ paddingLeft: '10px', paddingRight: '10px' }}
                >
                  X
                </span>
              </div>
            ) : (
              <button className="text-blue-500 pr-8" onClick={() => setIsSearchActive(true)}>
                🔍
              </button>
            )}
          </div>
        </div>
 
        <div className="h-[35px] bg-white border-b border-gray-300">
          <table className="w-full h-full">
            <thead>
              <tr>
                <th className="text-gray-500 px-[10px] cursor-pointer" onClick={() => sortAgents('name')}>
                  <span className="inline-block pl-[18px]">Name</span>
                </th>
                <th className="text-gray-500 px-[10px] cursor-pointer" onClick={() => sortAgents('role')}>
                  <span className="inline-block pl-[18px]">Role</span>
                </th>
                <th className="text-gray-500 px-[10px] cursor-pointer" onClick={() => sortAgents('autoAssigned')}>
                  <span className="inline-block pl-[18px]">Auto Assignment</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
 
      <div
        className="flex flex-row items-center gap-6 min-h-[70px] cursor-pointer transition-colors bg-white border-b border-gray-300"
        onClick={handleOpenModal}
      >
        <div className="flex min-w-[50px] pl-2 items-center justify-end">
          <div className="flex h-[40px] w-[40px] bg-blue-500 rounded-full items-center justify-center">
            <span className="text-white text-xl">+</span>
          </div>
        </div>
        <p className="text-blue-500 font-semibold">Add new agent</p>
      </div>
 
      <div className="flex-grow bg-white rounded-b-lg h-full flex flex-col">
        <div className="flex-grow overflow-y-auto p-0">
          {filteredAgents.map((agent, index) => (
            <AgentRow
              key={agent.id}
              id={agent.id}
              name={agent.name}
              email={agent.email}
              role={agent.role === 'Admin' ? 'Admin' : 'Agent'} // Default to 'Agent' if role is missing or not 'Admin'
              autoAssigned={agent.autoAssigned || false} // Default to false if autoAssigned is missing
              iconColor={agent.iconColor}
              isSelected={selectedAgentIndex === index}
              onClick={() => handleRowClick(index, agent)}
            />
          ))}
        </div>
      </div>
 
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          onInviteComplete={(updatedAgents: DisplayAgent[]) => {
            const agentsWithColors = updatedAgents.map(agent => ({
              ...agent,
              iconColor: generateRandomColor(),
            }));
            setAgents(agentsWithColors);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
 
export default AgentsContainer;