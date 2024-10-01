package com.myapp.capstone.controller;
 
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.myapp.capstone.model.DisplayAgent;
import com.myapp.capstone.model.dto.EmailDto;
import com.myapp.capstone.service.DisplayAgentService;
 
@RestController
@RequestMapping("/api/displayagents")
@CrossOrigin(origins = "http://localhost:3000")
public class DisplayAgentController {
 
    @Autowired
    private DisplayAgentService displayAgentService;
 
    
    @PostMapping("/add")
    public ResponseEntity<String> addAgentToDisplayAgents(@RequestBody EmailDto emailDto) {
        
        String result = displayAgentService.addAgentToDisplayAgents(emailDto.getEmail());
 
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<DisplayAgent>> getAllDisplayAgents() {
        List<DisplayAgent> agents = displayAgentService.getAllDisplayAgents();
        
        if (agents.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(agents, HttpStatus.OK);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DisplayAgent> getDisplayAgentById(@PathVariable Long id) {
    	DisplayAgent agent = displayAgentService.getDisplayAgentById(id);
        
        if (agent != null) {
            return new ResponseEntity<>(agent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
 