package com.collabcode.collabcode.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.collabcode.service.UserService;
import com.collabcode.collabcode.exceptions.UsernameAlreadyExistsException;
import com.collabcode.collabcode.model.User;

@RestController
@RequestMapping("/user")
public class UserController {
    
    UserService UserService;

    @Autowired
    public UserController(UserService UserService) {
        this.UserService = UserService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(UserService.getAllUsers());
    }
    
    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody User User) throws Exception {
        if(UserService.getUserByUsername(User.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(UserService.save(User));
    }
}
