import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
 
// Define the Logo styled component
const Logo = styled('div')<{ isUnassigned?: boolean }>(({ theme, isUnassigned }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: isUnassigned ? 'transparent' : theme.palette.primary.main,
  color: isUnassigned ? 'transparent' : theme.palette.common.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  marginRight: 8,
  border: isUnassigned ? `1px solid ${theme.palette.divider}` : 'none',
}));
 
// Define the BlankPersonLogo component
const BlankPersonLogo = styled('div')({
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid gray',
});
 
interface AgentDropdownProps {
  agents: { agent: string; agentEmail: string }[];
  selectedAgent: string | null;
  onAgentChange: (agentName: string | null) => void;
}
 
// Styled FormControl with reduced width
const SmallWidthFormControl = styled(FormControl)({
  width: '200px', // Set desired width
});
 
const AgentDropdown: React.FC<AgentDropdownProps> = ({ agents, selectedAgent, onAgentChange }) => {
  // Create a unique list of agents
  const uniqueAgents = Array.from(new Map(agents.map(agent => [agent.agent, agent])).values());
 
  return (
    <SmallWidthFormControl variant="outlined">
      <InputLabel>Assign Agent</InputLabel>
      <Select
        value={selectedAgent || ''}
        onChange={(event) => onAgentChange( event.target.value)}
        label="Assign Agent"
      >
        {uniqueAgents.length === 0 && (
          <MenuItem value="Unassigned">
            <Logo isUnassigned>
              <BlankPersonLogo />
            </Logo>
            <div>
              <strong>Unassigned</strong>
              <div style={{ fontSize: '0.75rem', color: 'gray' }}></div>
            </div>
          </MenuItem>
        )}
        {uniqueAgents.map(({ agent, agentEmail }) => (
          <MenuItem key={agentEmail} value={agent}>
            <Logo isUnassigned={agent.toLowerCase() === 'unassigned'}>
              {agent.toLowerCase() !== 'unassigned' ? (
                agent.charAt(0).toUpperCase()
              ) : (
                <BlankPersonLogo />
              )}
            </Logo>
            <div>
              <strong>{agent}</strong>
              <div style={{ fontSize: '0.75rem', color: 'gray' }}>
                {agentEmail}
              </div>
            </div>
          </MenuItem>
        ))}
      </Select>
    </SmallWidthFormControl>
  );
};
 
export default AgentDropdown;
