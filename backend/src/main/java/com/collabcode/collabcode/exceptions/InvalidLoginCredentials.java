package com.collabcode.collabcode.exceptions;

public class InvalidLoginCredentials extends Exception {
    String message;

    public InvalidLoginCredentials() {}

    public InvalidLoginCredentials(String message) {
        super(message);
        this.message = "Username or Password is incorrect";
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String newMessage) {
        this.message = newMessage;
    }
}
