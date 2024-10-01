package com.myapp.capstone.service;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.myapp.capstone.model.Agent;
import com.myapp.capstone.model.DisplayAgent;
import com.myapp.capstone.repository.AgentRepository;
import com.myapp.capstone.repository.DisplayAgentRepository;
 
import java.util.List;
import java.util.Optional;
 
@Service
public class DisplayAgentService {
 
    @Autowired
    private AgentRepository agentRepository;
 
    @Autowired
    private DisplayAgentRepository displayAgentRepository;
 
    public String addAgentToDisplayAgents(String email) {

        Agent agent = agentRepository.findByEmail(email);
 
        if (agent == null) {
            return "Agent with email " + email + " not found.";
        }
        
        DisplayAgent existingDisplayAgent = displayAgentRepository.findByEmail(email);
        
        if (existingDisplayAgent != null) {
            return "Agent with email " + email + " is already in display_agents";
        }
 
        DisplayAgent displayAgent = new DisplayAgent();
        displayAgent.setId(agent.getId());
        displayAgent.setEmail(agent.getEmail());
        displayAgent.setName(agent.getName());
        displayAgent.setRole("Agent"); 
        displayAgent.setAutoAssigned(false);
 
        displayAgentRepository.save(displayAgent);
 
        return "Email successfully added";
    }
 
    public List<DisplayAgent> getAllDisplayAgents() {
        return displayAgentRepository.findAll();
    }
 
    public DisplayAgent getDisplayAgentById(Long id) {
        Optional<DisplayAgent> displayAgent = displayAgentRepository.findById(id);
        return displayAgent.orElse(null);
    }
}
 
 