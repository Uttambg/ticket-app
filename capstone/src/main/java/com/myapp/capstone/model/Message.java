package com.myapp.capstone.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String content;

    @Lob
    private byte[] attachment;
    private String attachmentType;
    private String attachmentName;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonBackReference
    private Ticket ticket;
    

	public Message() {
    }

    public Message(String content, byte[] attachment, String attachmentType, String attachmentName, Ticket ticket) {
        this.content = content;
        this.attachment = attachment;
        this.attachmentType = attachmentType;
        this.attachmentName = attachmentName;
        this.ticket = ticket;
    }

    public Long getId() {
        return id;
    }
    
    public Long setId() {
    	return id;
    }

    public String getContent() {
        return content;
    }

    public byte[] getAttachment() {
        return attachment;
    }

    public String getAttachmentType() {
        return attachmentType;
    }

    public String getAttachmentName() {
        return attachmentName;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setId(Long id) {
		this.id = id;
	}

	public void setContent(String content) {
        this.content = content;
    }

    public void setAttachment(byte[] attachment) {
        this.attachment = attachment;
    }

    public void setAttachmentType(String attachmentType) {
        this.attachmentType = attachmentType;
    }

    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }
}
