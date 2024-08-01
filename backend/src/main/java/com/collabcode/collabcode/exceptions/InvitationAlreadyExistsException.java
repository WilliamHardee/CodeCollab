package com.collabcode.collabcode.exceptions;

public class InvitationAlreadyExistsException extends Exception{
    
    private String message;

    public InvitationAlreadyExistsException() {}

    public InvitationAlreadyExistsException(String msg) {
        super(msg);
        this.message = msg;
    }
}
