package com.myapp.capstone.service;
 
import com.myapp.capstone.model.UserDetails;
import com.myapp.capstone.repository.UserRepo;
import com.myapp.capstone.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@SpringBootTest
public class UserServiceTest {
 
    @InjectMocks
    private UserService userService;
 
    @Mock
    private UserRepo userRepository;
 
    private UserDetails user;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new UserDetails();
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setPassword("password"); 
    }
 
    @Test
    void testAddUser_Success() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);
        when(userRepository.save(user)).thenReturn(user);
 
        UserDetails result = userService.addUser(user);
 
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test User", result.getName());
 
        verify(userRepository, times(1)).save(user);
    }
 
    @Test
    void testAddUser_UserAlreadyExists() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
 
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.addUser(user);
        });
 
        assertEquals("User already exists with email: test@example.com", exception.getMessage());
 
        verify(userRepository, never()).save(any());
    }
}
 
 