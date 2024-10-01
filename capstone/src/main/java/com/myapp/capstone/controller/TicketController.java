package com.myapp.capstone.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myapp.capstone.model.Message;
import com.myapp.capstone.model.dto.MessageDto;
import com.myapp.capstone.model.dto.TicketDto;
import com.myapp.capstone.service.MessageService;
import com.myapp.capstone.service.TicketService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private MessageService messageService;

    public TicketController() {
    }

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@RequestBody TicketDto ticketDto) {
        if (ticketDto.getSubject() == null || ticketDto.getPriority() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        TicketDto newTicket = ticketService.createTicket(ticketDto);
        return new ResponseEntity<>(newTicket, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TicketDto>> getAllTickets() {
        List<TicketDto> tickets = ticketService.getAllTickets();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable String id) {
        Optional<TicketDto> ticket = ticketService.getTicketById(id);
        return ticket.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> updateTicket(@PathVariable String id, @RequestBody TicketDto updatedTicketDto) {
        if (updatedTicketDto.getSubject() == null && updatedTicketDto.getPriority() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        try {
            TicketDto updatedTicket = ticketService.updateTicket(id, updatedTicketDto);
            return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        try {
            ticketService.deleteTicket(id);
            return new ResponseEntity<>("Ticket not Found",HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Ticket not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageDto> addMessageToTicket(@PathVariable String id, @RequestBody MessageDto messageDto) {
        if (messageDto.getContent() == null && messageDto.getAttachment() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        try {
            MessageDto newMessage = ticketService.addMessageToTicket(id, messageDto);
            return new ResponseEntity<>(newMessage, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessagesForTicket(@PathVariable String id) {
        try {
            List<MessageDto> messages = ticketService.getMessagesForTicket(id);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/user/{userId}")
    public List<TicketDto> getTicketsByUserId(@PathVariable Long userId) {
        return ticketService.getTicketsByUserId(userId);
    }
    
    @GetMapping("/{ticketId}/messages/{messageId}")
    public ResponseEntity<Message> getMessageByIdInTicket(
            @PathVariable String ticketId, 
            @PathVariable Long messageId) {
        
        try {
            Optional<TicketDto> ticket = ticketService.getTicketById(ticketId);
            if (ticket.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Message message = messageService.getMessageById(messageId);

            if (message.getTicket().getId().equals(ticketId)) {
                return new ResponseEntity<>(message, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    
    @GetMapping("/agent/{agentId}/inprogress")
    public ResponseEntity<TicketDto> getOldestInProgressTicketByAgentId(@PathVariable Long agentId) {
        TicketDto ticket = ticketService.getOldestInProgressTicketByAgentId(agentId);
 
        if (ticket == null) {
            return ResponseEntity.noContent().build(); 
        }
 
        return ResponseEntity.ok(ticket);
    }
    
    @GetMapping("/agent/{agentId}")
    public List<TicketDto> getTicketsByAgentId(@PathVariable Long agentId) {
    	return ticketService.getTicketsByAgentId(agentId);
    }
    
}
