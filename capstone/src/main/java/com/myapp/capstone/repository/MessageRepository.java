package com.myapp.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myapp.capstone.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
	
}
