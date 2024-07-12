package com.collabcode.collabcode.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.collabcode.service.UserService;

import jakarta.validation.Valid;

import com.collabcode.collabcode.exceptions.UsernameAlreadyExistsException;
import com.collabcode.collabcode.model.User;

@RestController
@RequestMapping("/user")
public class UserController {
    
    UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userService.getAllUsers());
    }
    
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody User user) {
        boolean res = userService.login(user);
        if(res) {
            return  ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping("")
    public ResponseEntity createUser(@RequestBody User User) throws Exception {
        if(userService.getUserByUsername(User.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }
        userService.save(User);
        return ResponseEntity.ok().build();
    }
}
