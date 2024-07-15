package com.collabcode.collabcode.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.exceptions.InvalidLoginCredentials;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.UserRepository;

@Service
public class UserService {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(8);
    UserRepository UserRepository;

    @Autowired
    public UserService(UserRepository UserRepository) {
        this.UserRepository = UserRepository;
    }

    public User save(User newUser) {
        String encrpytedPassword = encoder.encode(newUser.getPassword());
        newUser.setPassword(encrpytedPassword);
        return UserRepository.save(newUser);
    }

    public List<User> getAllUsers(){
        return UserRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return UserRepository.findByUsername(username);
    }

    public void login(User loginUser) throws InvalidLoginCredentials {
        Optional<User> user = getUserByUsername(loginUser.getUsername());
        
        if(!user.isPresent()) {
            throw new InvalidLoginCredentials("Username or Password is incorrect");
        }

        if(!encoder.matches(loginUser.getPassword(), user.get().getPassword())) {
            throw new InvalidLoginCredentials("Username or Password is incorrect");
        }

       
    }

    public void addProject(User user, Project project) {
        user.addProject(project);
    }


}
