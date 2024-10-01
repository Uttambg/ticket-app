package com.myapp.capstone.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.myapp.capstone.model.Agent;
public interface AgentRepository extends JpaRepository<Agent,Long> {
 
	Agent findByEmail(String email);
	
}