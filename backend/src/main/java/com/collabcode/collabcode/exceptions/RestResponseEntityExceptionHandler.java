package com.collabcode.collabcode.exceptions;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

        List<String> messages = new ArrayList<>();

        messages.add(ex.getMessage());

        ErrorResponse response = new ErrorResponse(messages, 409, request.getDescription(false));
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    
    @ExceptionHandler(ConstraintViolationException.class) 
    public ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException ex, WebRequest request) {

        List<String> messages = new ArrayList<>();

        for (ConstraintViolation message: ex.getConstraintViolations()) {
            messages.add(message.getMessage());
        }

        ErrorResponse response = new ErrorResponse(messages, 406, request.getDescription(false));
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(response);
    }

    @ExceptionHandler(InvalidLoginCredentials.class)
    public ResponseEntity<Object> handleInvalidLoginCreadentials(Exception ex, WebRequest request) {
        List<String> messages = new ArrayList<>();

        messages.add(ex.getMessage());

        ErrorResponse response = new ErrorResponse(messages, 401, request.getDescription(false));
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @Override
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<String> messages = new ArrayList<>();

        for (FieldError message: ex.getFieldErrors()) {
            messages.add(message.getDefaultMessage());
        }

        ErrorResponse response = new ErrorResponse(messages, 400, request.getDescription(false));
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(response);
    }

    @ExceptionHandler({UserDoesNotExist.class, ProjectDoesNotExist.class})
    public ResponseEntity<Object> handleNotFoundExeptions(Exception ex, WebRequest request) {

        List<String> messages = new ArrayList<>();

        messages.add(ex.getMessage());

        ErrorResponse response = new ErrorResponse(messages, 404, request.getDescription(false));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}