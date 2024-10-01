package com.myapp.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.myapp.capstone.model.DisplayAgent;

public interface DisplayAgentRepository extends JpaRepository<DisplayAgent, Long>{
	DisplayAgent findByEmail(String email);
}