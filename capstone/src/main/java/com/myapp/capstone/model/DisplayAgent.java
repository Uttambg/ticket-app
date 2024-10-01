package com.myapp.capstone.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "display_agents")
public class DisplayAgent {
    @Id
    private Long id;
    private String name;
    private String email;
    private String role="Agent";
    private Boolean autoAssigned;
 
    public DisplayAgent() {
    	
	}
    public DisplayAgent(Long id, String name, String email, Boolean autoAssigned) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.autoAssigned = autoAssigned;
	}
	public DisplayAgent(String name, String email, Boolean autoAssigned) {
		this.name = name;
		this.email = email;
		this.autoAssigned = autoAssigned;
	}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public Boolean getAutoAssigned() {
        return autoAssigned;
    }
    public void setAutoAssigned(Boolean autoAssigned) {
        this.autoAssigned = autoAssigned;
    }
}
