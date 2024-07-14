package com.collabcode.collabcode.exceptions;

import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {
    private int status;
    private List<String> messages;
    private String uri;
    private LocalDateTime time;

    public ErrorResponse() {
        time = LocalDateTime.now();
    }

    public ErrorResponse(List<String> messages, int status, String uri) {
        this();
        this.messages = messages;
        this.status = status;
        this.uri = uri;
    }

    public int getStatus() {
        return status;
    }

    public List<String> getMessages() {
        return messages;
    }

    public String getUri() {
        return uri;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setMessages(List<String> message) {
        this.messages = message;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }
}