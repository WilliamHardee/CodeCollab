package com.collabcode.collabcode.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("")
    public ResponseEntity createProject(@RequestBody Project project) {
        projectService.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201));
    }
    
}
