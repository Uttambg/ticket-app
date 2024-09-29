// src/api/apiClient.ts
import axios from 'axios';
import { LoginRequest, LoginResponse, Message, Ticket } from '../types/Ticket'; // Adjust the import based on your project structure

const API_BASE_URL = 'http://localhost:8888';

export const fetchTickets = async (): Promise<Ticket[]> => {
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

export const addAgent = async (ticketId: string, agentId: number) => {
  const response = await axios.put(`${API_BASE_URL}/api/${ticketId}/assign-agent/${agentId}`, {
    // Include any necessary data here
    // e.g., status: "some status" if required by your API
  });
  return response.data;
};
 
// Function to add a message to a ticket
export const addMessageToTicket = (ticketId: string, message: Message): Promise<Message> => {
  return axios
    .post(`${API_BASE_URL}/api/tickets/${ticketId}/messages`, message)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error adding message:', error);
      throw error;
    });
};
 
// Function to fetch all messages for a ticket by ID
export const getMessagesForTicket = (ticketId: string): Promise<Message[]> => {
  return axios
    .get(`${API_BASE_URL}/api/tickets/${ticketId}/messages`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching messages:', error);
      throw error;
    });
};
 
// Function to delete a ticket by ID
export const deleteTicket = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/tickets/${id}`);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error; // Propagate error for handling in the calling component
  }
};
 
// Function to fetch ticket details by ID
export const fetchTicketDetails = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/tickets/${id}`);
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
