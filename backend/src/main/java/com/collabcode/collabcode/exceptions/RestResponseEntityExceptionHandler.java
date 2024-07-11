package com.collabcode.collabcode.exceptions;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<Object> handleUsernameAlreadyExistsException(Exception ex, WebRequest request) {
        Map<String, Object> errorBody = new LinkedHashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("error", "Username Conflict");
        errorBody.put("status", HttpStatus.CONFLICT.value());
        errorBody.put("message", ex.getMessage());
        errorBody.put("URI", request.getDescription(false));

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorBody);
    }

    @ExceptionHandler(ConstraintViolationException.class) 
    public ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException ex, WebRequest request) {
        List<String> violations = new ArrayList<>();
        for (ConstraintViolation message: ex.getConstraintViolations()) {
            violations.add(message.getMessage());
        }

        Map<String, Object> errorBody = new LinkedHashMap<>();

        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("error", "Constraint Violation");
        errorBody.put("status", HttpStatus.CONFLICT.value());
        errorBody.put("message", violations);
        errorBody.put("URI", request.getDescription(false));

        
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(errorBody);
    }
}