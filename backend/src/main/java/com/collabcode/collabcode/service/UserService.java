package com.collabcode.collabcode.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.DTO.CreateLoginDTO;
import com.collabcode.collabcode.exceptions.InvalidLoginCredentials;
import com.collabcode.collabcode.exceptions.UsernameAlreadyExistsException;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.ProjectRepository;
import com.collabcode.collabcode.repository.UserRepository;

import jakarta.transaction.Transactional;

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

    @Transactional
    public User create(CreateLoginDTO user) throws UsernameAlreadyExistsException {

        if (this.getUserByUsernameAndType(user.getUsername(), "LOCAL").isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        Optional<User> oAuthUser = this.getUserByUsernameAndType(user.getUsername(), "OAUTH");
        if (oAuthUser.isPresent()) {

            User existingUser = oAuthUser.get();
            existingUser.setAccountType("LOCAL");
            String encryptedPassword = encoder.encode(user.getPassword());
            existingUser.setPassword(encryptedPassword);
            return UserRepository.save(existingUser);
        }

        User newUser = new User(user.getUsername(), user.getPassword(), "LOCAL");
        String encryptedPassword = encoder.encode(newUser.getPassword());
        newUser.setPassword(encryptedPassword);
        return UserRepository.save(newUser);
    }

    @Transactional
    public User create(User user) {
        String encrpytedPassword = encoder.encode(user.getPassword());
        user.setPassword(encrpytedPassword);
        return UserRepository.save(user);
    }

    public Optional<User> getUserByUsernameAndType(String username, String type) {
        return UserRepository.getUserByUsernameAndType(username, type);
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

    public String login(CreateLoginDTO loginUser) throws InvalidLoginCredentials {
        String jwt = null;

        try {

            Authentication authentication = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword()));
            if (authentication.isAuthenticated()) {
                jwt = jwtService.GenerateToken(loginUser.getUsername());
            }
        } catch (Exception e) {
            throw new InvalidLoginCredentials("Username or password is incorrect");

        }
        return jwt;

    }

    @Transactional
    public void addProject(User user, Project project) {

        user.addProject(project);
        UserRepository.save(user);

    }

    public Optional<User> getIdByUsername(String username) {
        return UserRepository.getUserByUsername(username);
    }

}
