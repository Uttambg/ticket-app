package com.myapp.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myapp.capstone.model.Message;
import com.myapp.capstone.repository.MessageRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message getMessageById(Long messageId) {
    	return messageRepository.findById(messageId).orElseThrow(() -> 
    	new EntityNotFoundException("Message not found with id: " + messageId));
    }
}
