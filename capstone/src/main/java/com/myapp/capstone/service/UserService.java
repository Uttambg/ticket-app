package com.myapp.capstone.service;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.myapp.capstone.model.UserDetails;
import com.myapp.capstone.repository.UserRepo;
 
@Service
public class UserService {

	@Autowired
	private UserRepo userRepository;

	public UserDetails addUser(UserDetails userDetails) {

		 UserDetails existingUser = userRepository.findByEmail(userDetails.getEmail());
 
        if (existingUser!=null) {
            
            throw new RuntimeException("User already exists with email: " + userDetails.getEmail());
        }
        return userRepository.save(userDetails);

    }
 
}

 