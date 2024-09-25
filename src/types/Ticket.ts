// src/types/Ticket.ts
export interface Ticket {
  id: string; // Use string as IDs seem to be alphanumeric.
  subject: string;
  priority: string;
  status: string;
  assignedAgent: string | null; // Agent can be null if not assigned.
  createdAt: string; // Reflects the date format from the backend.
  updatedAt: string; 
  messages: Message[]; // Include the messages array.
  userId: number; // Use number for userId as per backend.
}

// Define a Message interface for the messages array
export interface Message {
  id: number;
  content: string;
  attachment: string | null;
  attachmentType: string | null;
  attachmentName: string | null;
  ticketId: string;
}

// src/types/User.ts
export interface User {
  id: number;
  email: string;
  name: string;
}


// src/types/DisplayAgent.ts
export interface DisplayAgent {
  id: number;        // Assuming the ID is numeric, matching Long in Java
  name: string;
  email: string;
  role?: string;     // Role can be optional, defaulting to "Agent" in your model
  autoAssigned?: boolean; // autoAssigned can also be optional
}


// types.ts
export interface LoginResponse {
  token: string;
  // role: string;
  // userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}
