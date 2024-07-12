package com.collabcode.collabcode.exceptions;


public class UsernameAlreadyExistsException extends Exception {

    private String message;

    public UsernameAlreadyExistsException() {}

    public UsernameAlreadyExistsException(String msg) {
        super(msg);
        this.message = msg;
    }

}
