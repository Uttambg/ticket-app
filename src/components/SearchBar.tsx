// src/components/SearchBar.tsx

import React from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder="Search... (e.g., open, closed)"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default SearchBar;
