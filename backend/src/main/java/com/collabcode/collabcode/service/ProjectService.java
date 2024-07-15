package com.collabcode.collabcode.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.ProjectRepository;

@Service
public class ProjectService {
    
    ProjectRepository projectRepository;
    UserService userService;

    @Autowired
    public ProjectService (ProjectRepository projectRepository, UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }

    public Optional<Project> findById(UUID id) {
        Optional<Project> projectOpt;
        List<Project> project =  projectRepository.findAllById(Collections.singleton(id));

        if(project.size() == 0) {
            projectOpt = Optional.empty();
        }
        else {
            projectOpt = Optional.of(project.get(0));
        }

        return projectOpt;
    }



    public Optional<List<Project>> findProjectsByUsername(String username) {
        Optional<User> user = userService.getUserByUsername(username);
        
        if(user.isEmpty()) {
            return Optional.empty();
        }
        return projectRepository.getProjectsById(user.get().getId());
    }
}
