package com.myapp.capstone.model.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TicketDto {
    private String id;
    private String subject;
    private String priority;
    private String status;
    private String assignedAgent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MessageDto> messages;
    private Long userId;

    public TicketDto() {
    }

    public TicketDto(String subject, String priority, Long userId, List<MessageDto> messages) {
        this.subject = subject;
        this.priority = priority;
        this.userId = userId;
        this.messages = messages != null ? messages : new ArrayList<>();
    }

    public TicketDto(String id, String subject, String priority, String status, String assignedAgent,
                     LocalDateTime createdAt, LocalDateTime updatedAt, List<MessageDto> messages, Long userId) {
        this.id = id;
        this.subject = subject;
        this.priority = priority;
        this.status = status;
        this.assignedAgent = assignedAgent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.messages = messages;
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedAgent() {
        return assignedAgent;
    }

    public void setAssignedAgent(String assignedAgent) {
        this.assignedAgent = assignedAgent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<MessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDto> messages) {
        this.messages = messages;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
