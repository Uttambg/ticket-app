
package com.myapp.capstone.service;
 
import com.myapp.capstone.model.Agent;
import com.myapp.capstone.model.Ticket;
import com.myapp.capstone.repository.AgentRepository;
import com.myapp.capstone.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
 
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
class AdminServiceImplTest {
 
    @InjectMocks
    private AdminServiceImpl adminService;
 
    @Mock
    private TicketRepository ticketRepository;
 
    @Mock
    private AgentRepository agentRepository;
 
    private Ticket ticket;
    private Agent agent;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ticket = new Ticket("1", "Open", null); 
        agent = new Agent("nk@gma.com", null); 
    }
 
    @Test
    void testAssignAgentToTicket_Success() {
        Long agentId = 1L;
 
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));
        when(agentRepository.findById(agentId)).thenReturn(Optional.of(agent));
        when(ticketRepository.save(ticket)).thenReturn(ticket);
 
        Ticket updatedTicket = adminService.assignAgentToTicket("1", agentId);
 
        assertNotNull(updatedTicket);
        assertEquals("InProgress", updatedTicket.getStatus());
        assertEquals(agent.getName(), updatedTicket.getAssignedAgent());
        assertEquals(agent, updatedTicket.getAgent()); 
        verify(ticketRepository).save(ticket); 
    }
 
    @Test
    void testAssignAgentToTicket_TicketNotFound() {
        Long agentId = 1L;
 
        when(ticketRepository.findById("1")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adminService.assignAgentToTicket("1", agentId);
        });
 
        assertEquals("Ticket not found", exception.getMessage());
    }
 
    @Test
    void testAssignAgentToTicket_AgentNotFound() {
        Long agentId = 1L;
 
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));
        when(agentRepository.findById(agentId)).thenReturn(Optional.empty());
 
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adminService.assignAgentToTicket("1", agentId);
        });
 
        assertEquals("Agent not found", exception.getMessage());
    }
 
    @Test
    void testAssignAgentToTicket_AgentIsNull() {
        Long agentId = 1L;
 
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));
        when(agentRepository.findById(agentId)).thenReturn(Optional.ofNullable(null));
 
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adminService.assignAgentToTicket("1", agentId);
        });
 
        assertEquals("Agent not found", exception.getMessage());
    }
}
 
 