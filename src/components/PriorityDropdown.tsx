import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
 
const SmallWidthFormControl = styled(FormControl)({
  width: '200px', 
});
 
interface PriorityDropdownProps {
  selectedPriority: string | null;
  onPriorityChange: (priority: string) => void;
}
 
const PriorityDropdown: React.FC<PriorityDropdownProps> = ({ selectedPriority, onPriorityChange }) => {
  const priorities = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' },
  ];
 
  return (
    <SmallWidthFormControl variant="outlined">
      <InputLabel>Set Priority</InputLabel>
      <Select
        value={selectedPriority || ''}
        onChange={(e) => onPriorityChange(e.target.value as string)}
        label="Set Priority"
      >
        {priorities.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </SmallWidthFormControl>
  );
};
 
export default PriorityDropdown;
 
 