// src/types.ts

export interface Message {
    id: string; // Message ID
    text: string; // Content of the message
    timestamp: string; // Timestamp of the message
}

export interface Ticket {
    id: string; // Ticket ID
    subject: string;
    priority: string;
    status: string;
    assignedAgent: string | null;
    createdAt: string; // Creation timestamp
    updatedAt: string;
    messages: Message[];
    userId: number;
}
