import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DisplayAgent } from '../types/Ticket';
 
interface AgentDropdownProps {
  selectedAgent: number | null; // Use number | null for agent ID
  onAgentChange: (agentId: number | null) => void; // Callback to change agent ID
  allAgents: DisplayAgent[]; // Receive all agents as a prop
  loading: boolean; // To indicate if loading
}
 
const AgentDropdown: React.FC<AgentDropdownProps> = ({
  selectedAgent,
  onAgentChange,
  allAgents,
  loading,
}) => {
  return (
    <FormControl variant="outlined" style={{ width: '200px' }}>
      <InputLabel>Assign Agent</InputLabel>
      <Select
        value={selectedAgent !== null ? selectedAgent : -1} // Default to -1 for "Unassigned"
        onChange={(event) => {
          const value = event.target.value === "-1" ? null : Number(event.target.value);
          onAgentChange(value); // Convert to number or set to null
        }}
        label="Assign Agent"
      >
        <MenuItem value="-1">
          <div>
            <strong>Unassigned</strong>
          </div>
        </MenuItem>
 
        {loading ? (
          <MenuItem disabled>Loading agents...</MenuItem>
        ) : allAgents.length === 0 ? (
          <MenuItem disabled>
            <div>No agents available</div>
          </MenuItem>
        ) : (
          allAgents.map(({ id, name, email }) => (
            <MenuItem key={id} value={id}>
              <div>
                <strong>{name}</strong>
                <div style={{ fontSize: '0.75rem', color: 'gray' }}>
                  {email}
                </div>
              </div>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};
 
export default AgentDropdown;
 
 