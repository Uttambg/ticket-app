package com.myapp.capstone.service;
import org.springframework.stereotype.Service;
import com.myapp.capstone.model.Agent;
import com.myapp.capstone.model.Ticket;
import com.myapp.capstone.repository.AgentRepository;
import com.myapp.capstone.repository.TicketRepository;
import com.myapp.capstone.service.AdminService;
@Service
public class AdminServiceImpl implements AdminService {
    private final TicketRepository ticketRepository;
    private final AgentRepository agentRepository;
    public AdminServiceImpl(TicketRepository ticketRepository, AgentRepository agentRepository) {
        this.ticketRepository = ticketRepository;
        this.agentRepository = agentRepository;
    }
    @Override
    public Ticket assignAgentToTicket(String ticketId, Long agentId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
 
        ticket.setAgent(agent);
 
        ticket.setStatus("InProgress");
        ticket.setAssignedAgent(agent.getName());
        return ticketRepository.save(ticket);
    }

}
