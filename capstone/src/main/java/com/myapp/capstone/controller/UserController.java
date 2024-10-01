package com.myapp.capstone.controller;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.myapp.capstone.model.dto.UserDto;
import com.myapp.capstone.service.UserLoginService;
 
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
 
	
	
	@Autowired
	private UserLoginService userLoginService;
	
	
	@GetMapping("/get/{id}")
	public ResponseEntity<UserDto> createTicket(@PathVariable Long id) {
	    
	    UserDto userDto = userLoginService.findUser(id);
	    return new ResponseEntity<>(userDto, HttpStatus.OK);
	}
 
}
 
 