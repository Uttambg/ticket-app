import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
 
// Styled FormControl with consistent width
const SmallWidthFormControl = styled(FormControl)({
  width: '200px', // Set desired width
});
 
interface StatusDropdownProps {
  selectedStatus: string | null;
  setSelectedStatus: (status: string) => void;
}
 
const StatusDropdown: React.FC<StatusDropdownProps> = ({ selectedStatus, setSelectedStatus }) => {
  const statuses = [
    { value: 'New', label: 'New' },
    { value: 'InProgress', label: 'In Progress' },
    { value: 'Solved', label: 'Solved' },
    { value: 'Closed', label: 'Closed' },
  ];
 
  return (
    <SmallWidthFormControl variant="outlined">
      <InputLabel>Set Status</InputLabel>
      <Select
        value={selectedStatus || ''}
        onChange={(e) => setSelectedStatus(e.target.value)}
        label="Set Status"
      >
        {statuses.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </SmallWidthFormControl>
  );
};
 
export default StatusDropdown;
 
 