import React, { useState, useEffect, useRef } from 'react';
import { DisplayAgent } from '../types/Ticket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface AgentDropdownProps {
  agents: DisplayAgent[];
  onSelect: (agent: DisplayAgent | null) => void;
  selectedAgent: DisplayAgent | null;
  onClose: () => void; 
}

const AgentInfoDropdown: React.FC<AgentDropdownProps> = ({ agents, onSelect, selectedAgent, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (agent: DisplayAgent | null) => {
    onSelect(agent);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose(); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md mt-1 max-h-60 overflow-y-auto p-3">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />

        <ul className="flex flex-col  p-0 max-h-40 overflow-y-auto">
          <li
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelect(null)}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            <span>Unassigned</span>
          </li>

          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <li
                key={agent.id}
                className="flex flex-row items-center  cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(agent)}
              >
                
                <div className="flex w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 text-white font-semibold">
                  {agent.name.charAt(0).toUpperCase()}
                </div>
                
                
                <div className=" flex flex-col ">
                  <p className="text-sm  m-0">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.email}</p>
                </div>

                
                {selectedAgent?.id === agent.id && (
                  <FontAwesomeIcon icon={faCheck} className="ml-auto text-green-500" />
                )}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No agents found</li>
          )}
        </ul>
      </div>
    </div>
  );
};


export default AgentInfoDropdown;
