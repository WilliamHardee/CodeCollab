package com.collabcode.collabcode.exceptions;

public class JwtAuthenticationException extends RuntimeException {
    public JwtAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}