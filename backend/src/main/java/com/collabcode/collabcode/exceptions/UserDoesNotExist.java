package com.collabcode.collabcode.exceptions;


public class UserDoesNotExist extends Exception {

    private String message;

    public UserDoesNotExist() {}

    public UserDoesNotExist(String msg) {
        super(msg);
        this.message = msg;
    }


}
