package com.collabcode.collabcode.exceptions;


public class ProjectDoesNotExist extends Exception {

    private String message;

    public ProjectDoesNotExist() {}

    public ProjectDoesNotExist(String msg) {
        super(msg);
        this.message = msg;
    }

}
