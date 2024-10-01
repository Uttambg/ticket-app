package com.myapp.capstone.model.dto;
 
public class UserDto {
 
	public UserDto() {
		
	}
	
	public UserDto(Long id, String email, String name) {
		super();
		this.id = id;
		this.email = email;
		this.name = name;
	}
 
 
	private Long id;
 
    private String email;
 
    private String name;
 
	public Long getId() {
		return id;
	}
 
	public void setId(Long id) {
		this.id = id;
	}
 
	public String getEmail() {
		return email;
	}
 
	public void setEmail(String email) {
		this.email = email;
	}
 
	public String getname() {
		return name;
	}
 
	public void setname(String name) {
		this.name = name;
	}
 
}
 
 