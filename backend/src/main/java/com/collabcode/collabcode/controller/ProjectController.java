package com.collabcode.collabcode.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.collabcode.CollabcodeApplication;
import com.collabcode.collabcode.DTO.CreateProjectDTO;
import com.collabcode.collabcode.DTO.SaveProjectDTO;
import com.collabcode.collabcode.exceptions.ProjectDoesNotExist;
import com.collabcode.collabcode.exceptions.UserDoesNotExist;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.service.ProjectService;
import com.collabcode.collabcode.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/project")
public class ProjectController {

    UserService userService;
    ProjectService projectService;

    @Autowired
    public ProjectController(UserService userService, ProjectService projectService) {
        this.userService = userService;
        this.projectService = projectService;
    }

    @PostMapping("")
    public ResponseEntity createProject(@RequestBody CreateProjectDTO project) throws Exception {
        
        Project newProject = projectService.save(new Project(project.getProjectName(), project.getProjectData(), project.getLanguage()));

        Optional<User> optionalUser = userService.getUserByUsername(project.getUsername());
        optionalUser.orElseThrow(() -> new UserDoesNotExist("User: " + project.getUsername() + " does not exist"));
     
      
        User user = optionalUser.get();

        user.addProject(newProject);
        userService.save(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201, "project_id", newProject.getId()));
    }

    @GetMapping("/{username}")
    public ResponseEntity findProjectsByUsername(@PathVariable("username") String username) {
        Optional<List<Project>> projects = projectService.findProjectsByUsername(username);
        
        if(projects.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200, "projects", Collections.<String>emptyList()));
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200, "projects", projects.get()));
    }

    @GetMapping("/getProject/{id}")
    public ResponseEntity findProjectById(@PathVariable("id") UUID id) throws ProjectDoesNotExist {
        Optional<Project> project = projectService.findById(id);
        
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200, "project", project.get()));
    }

    @PutMapping("/save")
    public ResponseEntity saveProject(@RequestBody SaveProjectDTO saveProjectDTO) throws ProjectDoesNotExist {
        projectService.saveProject(saveProjectDTO.getProjectID(), saveProjectDTO.getProjectData());

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200));
    }
    
    
}
