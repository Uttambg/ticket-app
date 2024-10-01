package com.myapp.capstone.model;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "trash_tickets")
public class DeletedTickets {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String status = "delete";

    private String assignedAgent;

    private LocalDateTime createdAt;

    private LocalDateTime deletedAt;

    private Long userId;

    private Long agentId;

    private String userName;

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public DeletedTickets() {}

    public DeletedTickets(Ticket ticket) {
        this.id = ticket.getId();
        this.subject = ticket.getSubject();
        this.priority = ticket.getPriority();
        this.assignedAgent = ticket.getAssignedAgent();
        this.createdAt = ticket.getCreatedAt();
        this.deletedAt = LocalDateTime.now(); // Set the current timestamp

        if (ticket.getUser() != null) {
            this.userName = ticket.getUser().getName();
            this.userId = ticket.getUser().getId();
        }

        if (ticket.getAgent() != null) {
            this.agentId = ticket.getAgent().getId();
        } else {
            this.agentId = null;
        }
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

    public LocalDateTime getUpdatedAt() {
        return deletedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.deletedAt = updatedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    @PrePersist
    protected void onCreate() {
        deletedAt = LocalDateTime.now();
    }
}
