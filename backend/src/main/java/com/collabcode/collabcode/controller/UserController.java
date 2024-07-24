package com.collabcode.collabcode.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.swing.text.html.Option;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.collabcode.service.JwtService;
import com.collabcode.collabcode.service.ProjectService;
import com.collabcode.collabcode.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import com.collabcode.collabcode.exceptions.InvalidLoginCredentials;
import com.collabcode.collabcode.exceptions.ProjectDoesNotExist;
import com.collabcode.collabcode.exceptions.UserDoesNotExist;
import com.collabcode.collabcode.exceptions.UsernameAlreadyExistsException;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/user")
public class UserController {

    
    
    UserService userService;
    ProjectService projectService;

    @Autowired
    public UserController(UserService userService, ProjectService projectService) {
        this.userService = userService;
        this.projectService = projectService;
    }

    @GetMapping("")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userService.getAllUsers());
    }

    @PostMapping("/logout")
    public ResponseEntity logout(HttpServletResponse response) throws InvalidLoginCredentials {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
            .httpOnly(true)  // or false if you need JavaScript access
            .secure(false)
            .path("/")
            .maxAge(0)
            .sameSite("Lax")
            .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().body(Map.of("status", 200));
    }

    @PostMapping("/login")
    public ResponseEntity login(@Valid @RequestBody User user, HttpServletResponse response) throws InvalidLoginCredentials {
        String jwt = userService.login(user);
        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
            .httpOnly(true)  // or false if you need JavaScript access
            .secure(false)
            .path("/")
            .maxAge(3600)
            .sameSite("Lax")
            .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().body(Map.of("status", 200));
    }

    @PostMapping("/create")
    public ResponseEntity createUser(@Valid @RequestBody User User) throws Exception {
        if(userService.getUserByUsername(User.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }
        userService.create(User);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201));
    }

    @PutMapping("/addProject/{user_name}/{project_id}")
    public ResponseEntity addProject(@PathVariable("user_name") String user_name, @PathVariable("project_id") UUID project_id) throws Exception {
        Optional<User> optionalUser = userService.getUserByUsername(user_name);
        Optional<Project> optionalProject = projectService.findById(project_id);

        optionalUser.orElseThrow(() -> new UserDoesNotExist("User: " + user_name + " does not exist"));
        optionalProject.orElseThrow(() -> new ProjectDoesNotExist("Project with id: " + project_id + " does not exist"));
      
        User user = optionalUser.get();
        Project project = optionalProject.get();

        user.addProject(project);
        userService.save(user);
        
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200));
    }

    @DeleteMapping("/deleteProject/{user_name}/{project_id}")
    public ResponseEntity deleteProject(@PathVariable("user_name") String user_name, @PathVariable("project_id") UUID project_id) throws Exception {
        Optional<User> optionalUser = userService.getUserByUsername(user_name);
        Optional<Project> optionalProject = projectService.findById(project_id);

        optionalUser.orElseThrow(() -> new UserDoesNotExist("User: " + user_name + " does not exist"));
        optionalProject.orElseThrow(() -> new ProjectDoesNotExist("Project with id: " + project_id + " does not exist"));
      
        User user = optionalUser.get();
        Project project = optionalProject.get();

        projectService.removeUser(project, user);
        userService.save(user);
        
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200));
    }

}
