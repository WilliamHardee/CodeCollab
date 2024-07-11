package com.collabcode.collabcode.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.UserRepository;

@Service
public class UserService {
    UserRepository UserRepository;

    @Autowired
    public UserService(UserRepository UserRepository) {
        this.UserRepository = UserRepository;
    }

    public User save(User newUser) {
       return UserRepository.save(newUser);
    }

    public List<User> getAllUsers(){
        return UserRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return UserRepository.findByUsername(username);
    }


}
