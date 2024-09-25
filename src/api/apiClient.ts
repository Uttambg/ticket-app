// src/api/apiClient.ts
import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types/Ticket'; // Adjust the import based on your project structure

const API_BASE_URL = 'http://localhost:8888';

export const fetchTickets = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/tickets`);
  return response.data;
};

export const fetchUserById = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/users/get/${id}`);
  return response.data;
};

export const fetchTicketsByUserId = async (userId: number) => {
  const response = await axios.get(`${API_BASE_URL}/api/tickets/user/${userId}`);
  return response.data;
};

export const fetchAllAgents = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/displayagents/all`);
  return response.data;
};

export const fetchAgentById = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/api/displayagents/${id}`);
  return response.data;
};

export const updateTicket = async (id: string, updatedData: { status: string | null; priority: string | null; messages: any[] | null }) => {
  const response = await axios.put(`${API_BASE_URL}/api/tickets/${id}`, updatedData);
  return response.data;
};

// Function for login
export const apiClient = {
  login: async (email: string, password: string): Promise<string> => {
    const response = await fetch('http://localhost:8888/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const responseBody = await response.json();
    const { token } = responseBody; // Only extract the token from the response
    return token; // Return only the token
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
};
