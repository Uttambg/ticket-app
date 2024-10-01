package com.myapp.capstone.service;
 
import static org.junit.jupiter.api.Assertions.*;
 
import static org.mockito.Mockito.*;
 
import java.util.Optional;
 
import javax.crypto.SecretKey;
 
import org.junit.jupiter.api.BeforeEach;
 
import org.junit.jupiter.api.Test;
 
import org.mockito.InjectMocks;
 
import org.mockito.Mock;
 
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
 
import com.myapp.capstone.model.UserDetails;
 
import com.myapp.capstone.model.dto.LoginResponse;
 
import com.myapp.capstone.model.dto.UserDto;
 
import com.myapp.capstone.repository.UserRepo;
@SpringBootTest
public class UserLoginServiceTest {
 
    @InjectMocks
 
    private UserLoginService userLoginService;
 
    @Mock
 
    private UserRepo userRepository;
 
    private UserDetails user;
 
    @BeforeEach
 
    public void setUp() {
 
        MockitoAnnotations.openMocks(this);
 
        user = new UserDetails();
 
        user.setId(1L);
 
        user.setEmail("test@example.com");
 
        user.setPassword("password");
 
        user.setRole("USER");
 
        user.setName("Test User");
 
    }
 
    @Test
 
    public void testAuthenticate_Success() {
 
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
 
        UserDetails result = userLoginService.authenticate(user.getEmail(), user.getPassword());
 
        assertNotNull(result);
 
        assertEquals(user.getEmail(), result.getEmail());
 
    }
 
    @Test
 
    public void testAuthenticate_InvalidEmail() {
 
        when(userRepository.findByEmail("invalid@example.com")).thenReturn(null);
 
        UserDetails result = userLoginService.authenticate("invalid@example.com", "password");
 
        assertNull(result);
 
    }
 
    @Test
 
    public void testAuthenticate_InvalidPassword() {
 
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
 
        UserDetails result = userLoginService.authenticate(user.getEmail(), "wrongpassword");
 
        assertNull(result);
 
    }
 
    @Test
 
    public void testFindUser_Success() {
 
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
 
        UserDto result = userLoginService.findUser(1L);
 
        assertNotNull(result);
 
        assertEquals(user.getId(), result.getId());
 
        assertEquals(user.getEmail(), result.getEmail());
 
        assertEquals(user.getName(), result.getname());
 
    }
 
    @Test
 
    public void testFindUser_NotFound() {
 
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
 
        Exception exception = assertThrows(RuntimeException.class, () -> {
 
            userLoginService.findUser(1L);
 
        });
 
        assertEquals("User not found with ID: 1", exception.getMessage());
 
    }
 
    @Test
 
    public void testGenerateToken() {
 
        String token = userLoginService.generateToken(user.getEmail(), user.getRole(), user.getId());
 
        assertNotNull(token);
 
        assertTrue(token.length() > 0);
 
    }
 
    @Test
 
    public void testLogin_Success() {
 
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
 
        LoginResponse response = userLoginService.login(user.getEmail(), user.getPassword());
 
        assertNotNull(response);
 
        assertNotNull(response.getToken());
 
    }
 
    @Test
 
    public void testLogin_InvalidEmail() {
 
        when(userRepository.findByEmail("invalid@example.com")).thenReturn(null);
 
        Exception exception = assertThrows(RuntimeException.class, () -> {
 
            userLoginService.login("invalid@example.com", user.getPassword());
 
        });
 
        assertEquals("Invalid email or password", exception.getMessage());
 
    }
 
    @Test
 
    public void testLogin_InvalidPassword() {
 
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
 
        Exception exception = assertThrows(RuntimeException.class, () -> {
 
            userLoginService.login(user.getEmail(), "wrongpassword");
 
        });
 
        assertEquals("Invalid email or password", exception.getMessage());
 
    }
 
}
 
 
 