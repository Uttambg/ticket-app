import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from './authContext';

interface DeletedTicket {
  id: string;
  subject: string;
  priority: string;
  status: string;
  assignedAgent: string | null;
  createdAt: string;
  updatedAt: string;
}
 
const PowerTable = () => {
  const [data, setData] = useState<DeletedTicket[]>([]);
  const { role, userId } = useAuth(); // Get role and userId from useAuth
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Determine the URL based on the role
        const url =
          role === 'admin'
            ? 'http://localhost:8888/api/deletedtickets/all'
            : `http://localhost:8888/api/deletedtickets/${userId}`;
 
        const response = await fetch(url);
 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
 
        const result = await response.json();
        console.log("Fetched data:", result);
 
        // Check if the result is an array and update state
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error('Expected an array, but got:', result);
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      }
    };
 
    fetchData();
  }, [role, userId]); // Add role and userId as dependencies
 
  return (
    <TableContainer
      className="sidebar-table-container"
      component={Paper}
      sx={{ marginLeft: "0", borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Assigned Agent</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Deleted Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.assignedAgent || 'N/A'}</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No deleted tickets found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
 
export default PowerTable;