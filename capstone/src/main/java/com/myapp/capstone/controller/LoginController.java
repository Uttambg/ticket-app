package com.myapp.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myapp.capstone.model.UserDetails;
import com.myapp.capstone.model.dto.LoginRequestDto;
import com.myapp.capstone.model.dto.LoginResponse;
import com.myapp.capstone.service.UserLoginService;
import com.myapp.capstone.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @Autowired
    private UserLoginService authService;
    
    @Autowired
    private UserService userService;

    public LoginController() {
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequestDto loginRequest) {
        UserDetails user = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
 
        if (user != null) {
            String token = authService.generateToken(loginRequest.getEmail(), user.getRole(), user.getId());
            LoginResponse response = new LoginResponse(token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(new LoginResponse("Invalid email or password")); // Return an error message
        }
    }
 
    
    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody UserDetails userDetails) {
        try {
            userService.addUser(userDetails);
            return new ResponseEntity<>("User added successfully", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
    
}
