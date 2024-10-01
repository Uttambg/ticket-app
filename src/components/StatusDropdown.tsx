 
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
 
const SmallWidthFormControl = styled(FormControl)({
  width: '200px', 
});
 
interface StatusDropdownProps {
  selectedStatus: string | null;
  setSelectedStatus: (status: string) => void;
  role: 'agent' | 'admin'; // Add role prop
}
 
const StatusDropdown: React.FC<StatusDropdownProps> = ({
  selectedStatus,
  setSelectedStatus,
  role,
}) => {
  const allStatuses = [
    { value: 'New', label: 'New' },
    { value: 'InProgress', label: 'In Progress' },
    { value: 'Solved', label: 'Solved' },
  ];
 
  const agentStatuses = [
    { value: 'InProgress', label: 'In Progress' },
    { value: 'Solved', label: 'Solved' },
  ];
 
  const statusesToDisplay = role === 'admin' ? allStatuses : agentStatuses;
 
  return (
    <SmallWidthFormControl variant="outlined">
      <InputLabel>Set Status</InputLabel>
      <Select
        value={selectedStatus || ''}
        onChange={(e) => setSelectedStatus(e.target.value)}
        label="Set Status"
      >
        {statusesToDisplay.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </SmallWidthFormControl>
  );
};
 
export default StatusDropdown;
 