
package com.myapp.capstone.service;
 
import com.myapp.capstone.model.Agent;
import com.myapp.capstone.model.DisplayAgent;
import com.myapp.capstone.repository.AgentRepository;
import com.myapp.capstone.repository.DisplayAgentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
 
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@SpringBootTest
class DisplayAgentServiceTest {
 
    @InjectMocks
    private DisplayAgentService displayAgentService;
 
    @Mock
    private AgentRepository agentRepository;
 
    @Mock
    private DisplayAgentRepository displayAgentRepository;
 
    private Agent agent;
    private DisplayAgent displayAgent;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        agent = new Agent("john.doe@example.com", "John Doe"); // Sample agent
        displayAgent = new DisplayAgent(1L, "john.doe@example.com", "John Doe", false); // Sample display agent
    }
 
    @Test
    void testAddAgentToDisplayAgents_Success() {
        String email = "john.doe@example.com";
 
        when(agentRepository.findByEmail(email)).thenReturn(agent);
        when(displayAgentRepository.findByEmail(email)).thenReturn(null);
        when(displayAgentRepository.save(any(DisplayAgent.class))).thenReturn(displayAgent);
 
        String result = displayAgentService.addAgentToDisplayAgents(email);
 
        assertEquals("Email successfully added", result);
        verify(displayAgentRepository).save(any(DisplayAgent.class)); // Verify save was called
    }
 
    @Test
    void testAddAgentToDisplayAgents_AgentNotFound() {
        String email = "nonexistent@example.com";
 
        when(agentRepository.findByEmail(email)).thenReturn(null);
 
        String result = displayAgentService.addAgentToDisplayAgents(email);
 
        assertEquals("Agent with email nonexistent@example.com not found.", result);
        verify(displayAgentRepository, never()).save(any(DisplayAgent.class)); // Verify save was not called
    }
 
    @Test
    void testAddAgentToDisplayAgents_AgentAlreadyDisplayed() {
        String email = "john.doe@example.com";
 
        when(agentRepository.findByEmail(email)).thenReturn(agent);
        when(displayAgentRepository.findByEmail(email)).thenReturn(displayAgent);
 
        String result = displayAgentService.addAgentToDisplayAgents(email);
 
        assertEquals("Agent with email john.doe@example.com is already in display_agents", result);
        verify(displayAgentRepository, never()).save(any(DisplayAgent.class)); // Verify save was not called
    }
 
    @Test
    void testGetAllDisplayAgents() {
        List<DisplayAgent> displayAgents = new ArrayList<>();
        displayAgents.add(displayAgent);
        when(displayAgentRepository.findAll()).thenReturn(displayAgents);
 
        List<DisplayAgent> result = displayAgentService.getAllDisplayAgents();
 
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(displayAgent, result.get(0));
    }
 
    @Test
    void testGetDisplayAgentById_Success() {
        Long id = 1L;
 
        when(displayAgentRepository.findById(id)).thenReturn(Optional.of(displayAgent));
 
        DisplayAgent result = displayAgentService.getDisplayAgentById(id);
 
        assertNotNull(result);
        assertEquals(displayAgent, result);
    }
 
    @Test
    void testGetDisplayAgentById_NotFound() {
        Long id = 1L;
 
        when(displayAgentRepository.findById(id)).thenReturn(Optional.empty());
 
        DisplayAgent result = displayAgentService.getDisplayAgentById(id);
 
        assertNull(result);
    }
}
 
 