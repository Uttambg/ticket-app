package com.myapp.capstone.model.dto;

public class MessageDto {
    private Long id;
    private String content;
    private byte[] attachment;
    private String attachmentType;
    private String attachmentName;
    private String ticketId;

    public MessageDto() {
    }

    public MessageDto(String content, byte[] attachment, String attachmentType, String attachmentName, String ticketId) {
        this.content = content;
        this.attachment = attachment;
        this.attachmentType = attachmentType;
        this.attachmentName = attachmentName;
        this.ticketId = ticketId;
    }

    public MessageDto(Long id, String content, byte[] attachment, String attachmentType, String attachmentName, String ticketId) {
        this.id = id;
        this.content = content;
        this.attachment = attachment;
        this.attachmentType = attachmentType;
        this.attachmentName = attachmentName;
        this.ticketId = ticketId;
    }

    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public byte[] getAttachment() {
        return attachment;
    }

    public void setAttachment(byte[] attachment) {
        this.attachment = attachment;
    }

    public String getAttachmentType() {
        return attachmentType;
    }

    public void setAttachmentType(String attachmentType) {
        this.attachmentType = attachmentType;
    }

    public String getAttachmentName() {
        return attachmentName;
    }

    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }
}
