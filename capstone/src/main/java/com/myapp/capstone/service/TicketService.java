package com.myapp.capstone.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myapp.capstone.model.DeletedTickets;
import com.myapp.capstone.model.Message;
import com.myapp.capstone.model.Ticket;
import com.myapp.capstone.model.UserDetails;
import com.myapp.capstone.model.dto.MessageDto;
import com.myapp.capstone.model.dto.TicketDto;
import com.myapp.capstone.repository.DeletedTicketRepository;
import com.myapp.capstone.repository.MessageRepository;
import com.myapp.capstone.repository.TicketRepository;
import com.myapp.capstone.repository.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private DeletedTicketRepository deletedTicketRepository;

    @Autowired
    private UserRepo userRepository;

    @Transactional
    public TicketDto createTicket(TicketDto ticketDto) {
    	Ticket ticket = new Ticket();
        ticket.setSubject(ticketDto.getSubject());
        ticket.setPriority(ticketDto.getPriority());
        ticket.setStatus("NEW"); // Default status
 
        // Fetch user by ID and set it
        UserDetails user = userRepository.findById(ticketDto.getUserId())
                                         .orElseThrow(() -> new RuntimeException("User not found"));
 
        ticket.setUser(user);
        ticket.setMessages(new ArrayList<>()); // Initialize messages list
 
        // Save the ticket first to generate an ID
        Ticket savedTicket = ticketRepository.save(ticket);
 
        // Process and save initial messages
        if (ticketDto.getMessages() != null) {
            for (MessageDto messageDto : ticketDto.getMessages()) {
                Message message = new Message();
                message.setContent(messageDto.getContent());
                message.setAttachment(messageDto.getAttachment());
                message.setAttachmentType(messageDto.getAttachmentType());
                message.setAttachmentName(messageDto.getAttachmentName());
                message.setTicket(savedTicket); // Associate with the ticket
 
                // Save the message
                messageRepository.save(message);
                savedTicket.getMessages().add(message); // Add to ticket's message list
            }
            //ticketRepository.save(savedTicket); // Update ticket with messages
        }
 
        return convertToDto(savedTicket);
    }

    public List<TicketDto> getAllTickets() {
        return ticketRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public Optional<TicketDto> getTicketById(String id) {
        return ticketRepository.findById(id).map(this::convertToDto);
    }

    public TicketDto updateTicket(String id, TicketDto updatedTicketDto) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();

            if (updatedTicketDto.getStatus() != null) {
                ticket.setStatus(updatedTicketDto.getStatus());
            }

            if (updatedTicketDto.getPriority() != null) {
                ticket.setPriority(updatedTicketDto.getPriority());
            }

            if (updatedTicketDto.getMessages() != null && !updatedTicketDto.getMessages().isEmpty()) {
                for (MessageDto messageDto : updatedTicketDto.getMessages()) {
                    Message newMessage = convertToEntity(messageDto);
                    newMessage.setTicket(ticket);
                    ticket.getMessages().add(newMessage);
                }
            }

            Ticket updatedTicket = ticketRepository.save(ticket);
            return convertToDto(updatedTicket);
        } else {
            throw new RuntimeException("Ticket not found");
        }
    }

    public void deleteTicket(String id) {

        if (ticketRepository.existsById(id)) {
        	Ticket ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Ticket not found"));
        	// Save ticket to DeletedTicket table

            DeletedTickets deletedTicket = new DeletedTickets(ticket);

            deletedTicketRepository.save(deletedTicket);

            // Delete ticket from original Ticket table
            ticketRepository.deleteById(id);
        } else {
        	throw new RuntimeException("Ticket not found");
        }
    }

    public MessageDto addMessageToTicket(String ticketId, MessageDto messageDto) {
        Ticket existingTicket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Message newMessage = new Message();
        newMessage.setContent(messageDto.getContent());
        newMessage.setAttachment(messageDto.getAttachment());
        newMessage.setAttachmentType(messageDto.getAttachmentType());
        newMessage.setAttachmentName(messageDto.getAttachmentName());
        newMessage.setTicket(existingTicket);

        messageRepository.save(newMessage);
        existingTicket.getMessages().add(newMessage);
        ticketRepository.save(existingTicket);

        return convertToDto(newMessage);
    }

    public List<MessageDto> getMessagesForTicket(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

        return ticket.getMessages().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    private TicketDto convertToDto(Ticket ticket) {
        return new TicketDto(
            ticket.getId(),
            ticket.getSubject(),
            ticket.getPriority(),
            ticket.getStatus(),
            ticket.getAssignedAgent(),
            ticket.getCreatedAt(),
            ticket.getUpdatedAt(),
            ticket.getMessages().stream().map(this::convertToDto).collect(Collectors.toList()),
            ticket.getUser().getId()
        );
    }

    private MessageDto convertToDto(Message message) {
        return new MessageDto(
            message.getId(),
            message.getContent(),
            message.getAttachment(),
            message.getAttachmentType(),
            message.getAttachmentName(),
            message.getTicket().getId()
        );
    }

    private Message convertToEntity(MessageDto messageDto) {
        Message message = new Message();
        message.setContent(messageDto.getContent());
        message.setAttachment(messageDto.getAttachment());
        message.setAttachmentType(messageDto.getAttachmentType());
        message.setAttachmentName(messageDto.getAttachmentName());
        return message;
    }
    
    public List<TicketDto> getTicketsByUserId(Long userId) {
        // Fetch tickets from the repository by user ID
        List<Ticket> tickets = ticketRepository.findByUser_Id(userId);

        // Convert the list of Ticket entities to TicketDto
        return tickets.stream()
                      .map(this::convertToDto)
                      .collect(Collectors.toList());
    }
    
    public List<DeletedTickets> getAllDeletedTickets() {
        return deletedTicketRepository.findAll();
    }
    
    public DeletedTickets getDeletedTicketById(String id) {
        return deletedTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deleted ticket not found"));
    }
    
    
    public List<DeletedTickets> getDeletedTicketByUserId(Long id) {
    	List<DeletedTickets> dt= deletedTicketRepository.findByUserId(id);
    	if(dt !=null) {
    		return dt;
    	}
    	else return null;
    }
    
    
    public TicketDto getOldestInProgressTicketByAgentId(Long agentId) {
        Ticket ticket = ticketRepository.findFirstByAgent_IdAndStatusOrderByCreatedAtAsc(agentId, "InProgress");
        if (ticket == null) {
            System.out.println("No ticket found for agent ID: " + agentId + " with status 'InProgress'");
            return null;  
        } else {
            System.out.println("Found ticket with ID: " + ticket.getId() + " for agent ID: " + agentId);
        }
        return convertToDto(ticket);
    }
    
    public List<TicketDto> getTicketsByAgentId(Long id) {
    	
    	 Optional<UserDetails> user = userRepository.findById(id);
    	
    	 UserDetails userDetails = user.get();
    	List<Ticket> tickets = ticketRepository.findByAssignedAgent(userDetails.getName());
    	
    	return tickets.stream()
    			.map(this::convertToDto)
    			.collect(Collectors.toList());
    }
 
}

