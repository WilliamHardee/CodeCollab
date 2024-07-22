package com.collabcode.collabcode.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.exceptions.InvalidLoginCredentials;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(8);
    UserRepository UserRepository;

    @Autowired
    public UserService(UserRepository UserRepository) {
        this.UserRepository = UserRepository;
    }

    public User create(User newUser) {
        String encrpytedPassword = encoder.encode(newUser.getPassword());
        newUser.setPassword(encrpytedPassword);
        return UserRepository.save(newUser);
    }

    public User save(User newUser) {
        return UserRepository.save(newUser);
    }

    public List<User> getAllUsers() {
        return UserRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return UserRepository.findByUsername(username);
    }

    public String login(User user) throws InvalidLoginCredentials {
        String jwt = null;
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            if (authentication.isAuthenticated()) {
                jwt = jwtService.GenerateToken(user.getUsername());
            }
        } catch (Exception e) {
            throw new InvalidLoginCredentials("Username or password is incorrect");

        }
        return jwt;

    }

    public void addProject(User user, Project project) {
        user.addProject(project);
        UserRepository.save(user);
    }

    public Optional<User> getIdByUsername(String username) {
        return UserRepository.getUserByUsername(username);
    }

}
