package com.myapp.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myapp.capstone.model.Ticket;
import com.myapp.capstone.service.AdminService;

@RestController

@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

	@Autowired

    private AdminService adminService;

	@PutMapping("/{ticketId}/assign-agent/{agentId}")
    public ResponseEntity<Ticket> assignAgentToTicket(@PathVariable String ticketId, @PathVariable Long agentId) {
        try {
            Ticket updatedTicket = adminService.assignAgentToTicket(ticketId, agentId);
            return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
 