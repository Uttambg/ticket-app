package com.myapp.capstone.service; 

import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myapp.capstone.model.UserDetails;
import com.myapp.capstone.model.dto.LoginResponse; // Import the LoginResponse DTO
import com.myapp.capstone.model.dto.UserDto;
import com.myapp.capstone.repository.UserRepo;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service

public class UserLoginService {

    @Autowired

    private UserRepo userRepository;

    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    private static final long EXPIRATION_TIME = 60000;

    public UserDetails authenticate(String email, String password) {

        UserDetails user = userRepository.findByEmail(email);

        if (user == null || !user.getPassword().equals(password)) {

            return null;

        }

        return user;

    }

    public UserDto findUser(Long id) {

        Optional<UserDetails> user = userRepository.findById(id);

        if (user.isPresent()) {

            UserDetails userDetails = user.get();

            UserDto userDto = new UserDto();

            userDto.setId(userDetails.getId()); 

            userDto.setEmail(userDetails.getEmail());

            userDto.setname(userDetails.getName());

            return userDto;

        } else {

            throw new RuntimeException("User not found with ID: " + id);

        }

    }

    public String generateToken(String email, String role, Long userId) {

        return Jwts.builder()

                .setSubject(email)

                .claim("role", role)

                .claim("userId", userId) 

                .setIssuedAt(new Date())

                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))

                .signWith(SECRET_KEY)

                .compact();

    }
 
    public LoginResponse login(String email, String password) {

        UserDetails user = authenticate(email, password);

        if (user != null) {

            String token = generateToken(email, user.getRole(), user.getId()); 

            return new LoginResponse(token); 

        }

        throw new RuntimeException("Invalid email or password");

    }
 
}

 