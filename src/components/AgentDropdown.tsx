import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DisplayAgent } from '../types/Ticket';
 
interface AgentDropdownProps {
  selectedAgent: number | null;
  onAgentChange: (agentId: number | null) => void;
  allAgents: DisplayAgent[];
  loading: boolean;
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
        value={selectedAgent !== null ? selectedAgent : ''}
        onChange={(event) => {
          const value = event.target.value === "" ? null : Number(event.target.value);
          onAgentChange(value);
        }}
        label="Assign Agent"
      >
       
       
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
 