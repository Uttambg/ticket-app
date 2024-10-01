package com.myapp.capstone.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myapp.capstone.model.DeletedTickets;
import com.myapp.capstone.service.TicketService;

@RestController
@RequestMapping("/api/deletedtickets")
@CrossOrigin(origins = "http://localhost:3000")
public class DeleteTicketController {
	
	@Autowired
	private TicketService ticketService;
	
	@GetMapping("/all")
	public ResponseEntity<List<DeletedTickets>> getAllDeletedTickets() {
	    List<DeletedTickets> deletedTickets = ticketService.getAllDeletedTickets();
	    return ResponseEntity.ok(deletedTickets);
	}
	
	@GetMapping("deleted/{id}")
    public ResponseEntity<DeletedTickets> getDeletedTicketById(@PathVariable String id) {
        DeletedTickets deletedTicket = ticketService.getDeletedTicketById(id);
        return ResponseEntity.ok(deletedTicket);
    }
	
	@GetMapping("/{id}")
	public ResponseEntity<List<DeletedTickets>> getAllDeletedTicketsByUser(@PathVariable Long id) {
	    List<DeletedTickets> deletedTickets = ticketService.getDeletedTicketByUserId(id);
	    if(deletedTickets != null) {
	    return ResponseEntity.ok(deletedTickets);
	    }
	    else {
	    	return null;
	    }
	}
}
