
package com.myapp.capstone.service;
 
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
class TicketServiceTest {
 
    @InjectMocks
    private TicketService ticketService;
 
    @Mock
    private TicketRepository ticketRepository;
 
    @Mock
    private MessageRepository messageRepository;
 
    @Mock
    private DeletedTicketRepository deletedTicketRepository;
 
    @Mock
    private UserRepo userRepository;
 
    private TicketDto ticketDto;
    private Ticket ticket;
    private UserDetails user;
    private MessageDto messageDto;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
 
        user = new UserDetails();
        user.setId(1L);
        
        ticket = new Ticket();
        ticket.setId("1");
        ticket.setSubject("Test Ticket");
        ticket.setPriority("HIGH");
        ticket.setStatus("NEW");
        ticket.setUser(user);
        ticket.setMessages(new ArrayList<>());
 
        ticketDto = new TicketDto();
        ticketDto.setSubject("Test Ticket");
        ticketDto.setPriority("HIGH");
        ticketDto.setUserId(1L);
        ticketDto.setMessages(new ArrayList<>());
 
        messageDto = new MessageDto();
        messageDto.setContent("This is a test message.");
        messageDto.setAttachment(null);
    }
 
    @Test
    void testCreateTicket() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);
 
        TicketDto result = ticketService.createTicket(ticketDto);
 
        assertNotNull(result);
        assertEquals("Test Ticket", result.getSubject());
        assertEquals("NEW", result.getStatus());
        verify(ticketRepository).save(any(Ticket.class)); // Ensure ticket is saved
    }
 
    @Test
    void testGetAllTickets() {
        List<Ticket> tickets = new ArrayList<>();
        tickets.add(ticket);
 
        when(ticketRepository.findAll()).thenReturn(tickets);
 
        List<TicketDto> result = ticketService.getAllTickets();
 
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Ticket", result.get(0).getSubject());
    }
 
    @Test
    void testGetTicketById_Success() {
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));
 
        Optional<TicketDto> result = ticketService.getTicketById("1");
 
        assertTrue(result.isPresent());
        assertEquals("Test Ticket", result.get().getSubject());
    }
 
    @Test
    void testGetTicketById_NotFound() {
        when(ticketRepository.findById("1")).thenReturn(Optional.empty());
 
        Optional<TicketDto> result = ticketService.getTicketById("1");
 
        assertFalse(result.isPresent());
    }
 
    @Test
    void testUpdateTicket_Success() {
        TicketDto updatedTicketDto = new TicketDto();
        updatedTicketDto.setStatus("CLOSED");
        
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);
 
        TicketDto result = ticketService.updateTicket("1", updatedTicketDto);
 
        assertEquals("CLOSED", result.getStatus());
        verify(ticketRepository).save(ticket); 
    }
 
    @Test
    void testUpdateTicket_NotFound() {
        TicketDto updatedTicketDto = new TicketDto();
        updatedTicketDto.setStatus("CLOSED");
 
        when(ticketRepository.findById("1")).thenReturn(Optional.empty());
 
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ticketService.updateTicket("1", updatedTicketDto);
        });
 
        assertEquals("Ticket not found", exception.getMessage());
    }
 
    @Test
    void testDeleteTicket_Success() {
        when(ticketRepository.existsById("1")).thenReturn(true);
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));
 
        ticketService.deleteTicket("1");
 
        verify(deletedTicketRepository).save(any(DeletedTickets.class)); 
        verify(ticketRepository).deleteById("1");
    }
 
    @Test
    void testDeleteTicket_NotFound() {
        when(ticketRepository.existsById("1")).thenReturn(false);
 
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ticketService.deleteTicket("1");
        });
 
        assertEquals("Ticket not found", exception.getMessage());
    }
 
    @Test
    void testAddMessageToTicket() {
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));
        when(messageRepository.save(any(Message.class))).thenReturn(new Message());
 
        MessageDto result = ticketService.addMessageToTicket("1", messageDto);
 
        assertNotNull(result);
        verify(messageRepository).save(any(Message.class)); 
        assertEquals("This is a test message.", result.getContent());
    }
 
    @Test
    
    void testGetMessagesForTicket() {
        Ticket ticket = new Ticket();
        ticket.setId("1");
        
        List<Message> messages = new ArrayList<>();
        
        Message message = new Message();
        message.setId(1L); 
        message.setContent("Message content");
        message.setTicket(ticket); 
        messages.add(message);
        
        ticket.setMessages(messages);
 
        when(ticketRepository.findById("1")).thenReturn(Optional.of(ticket));

        List<MessageDto> result = ticketService.getMessagesForTicket("1");
 
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Message content", result.get(0).getContent());
        assertEquals("1", result.get(0).getTicketId()); 
    }
 
 
    @Test
    void testGetOldestInProgressTicketByAgentId() {
        when(ticketRepository.findFirstByAgent_IdAndStatusOrderByCreatedAtAsc(1L, "InProgress"))
                .thenReturn(ticket);
 
        TicketDto result = ticketService.getOldestInProgressTicketByAgentId(1L);
 
        assertNotNull(result);
        assertEquals("Test Ticket", result.getSubject());
    }
 
    @Test
    void testGetOldestInProgressTicketByAgentId_NotFound() {
    	
        when(ticketRepository.findFirstByAgent_IdAndStatusOrderByCreatedAtAsc(1L, "InProgress"))
                .thenReturn(null);
 
        TicketDto result = ticketService.getOldestInProgressTicketByAgentId(1L);
 
        assertNull(result); 
    }
}
 
 