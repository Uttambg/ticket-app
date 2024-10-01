
package com.myapp.capstone.service;
 
import com.myapp.capstone.model.Message;
import com.myapp.capstone.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
 
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@SpringBootTest
class MessageServiceTest {
 
    @InjectMocks
    private MessageService messageService;
 
    @Mock
    private MessageRepository messageRepository;
 
    private Message message;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        message = new Message();
        message.setId(1L); 
        message.setContent("Test message content"); 
    }
 
    @Test
    void testGetMessageById_Success() {
        Long messageId = 1L;
 
        when(messageRepository.findById(messageId)).thenReturn(Optional.of(message));
 
        Message result = messageService.getMessageById(messageId);
 
        assertNotNull(result);
        assertEquals(messageId, result.getId());
        assertEquals("Test message content", result.getContent()); 
    }
 
    @Test
    void testGetMessageById_NotFound() {
        Long messageId = 1L;
 
        when(messageRepository.findById(messageId)).thenReturn(Optional.empty());
 
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            messageService.getMessageById(messageId);
        });
 
        assertEquals("Message not found with id: " + messageId, exception.getMessage());
    }
}
 
 