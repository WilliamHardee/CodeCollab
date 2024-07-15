package com.collabcode.collabcode.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.service.ProjectService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/project")
public class ProjectController {

    ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("")
    public ResponseEntity createProject(@RequestBody Project project) {
        Project newProject = projectService.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201, "project_id", newProject.getId()));
    }

    @GetMapping("/{username}")
    public ResponseEntity findProjectByUsername(@PathVariable("username") String username) {
        Optional<List<Project>> projects = projectService.findProjectsByUsername(username);
        
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200, "projects", projects.get()));
    }
    
}
