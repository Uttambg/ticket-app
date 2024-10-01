package com.myapp.capstone.service;
 
import com.myapp.capstone.model.Ticket;
 
public interface AdminService {

	Ticket assignAgentToTicket(String ticketId, Long agentId);
 
}