package com.collabcode.collabcode.model;

public class Message {
    private String from;
    private String content;

    public Message() {

    }

    public Message(String from, String content) {
        this.from = from;
        this.content = content;
    }

    public String getFrom() {
        return this.from;
    }

    public String getContent() {
        return this.content;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
