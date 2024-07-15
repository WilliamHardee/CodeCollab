package com.collabcode.collabcode.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.repository.ProjectRepository;

@Service
public class ProjectService {
    
    ProjectRepository projectRepository;

    @Autowired
    public ProjectService (ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }
}
