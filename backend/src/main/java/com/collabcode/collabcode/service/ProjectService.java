package com.collabcode.collabcode.service;


import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.exceptions.ProjectDoesNotExist;
import com.collabcode.collabcode.model.Invitations;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.ProjectRepository;

import jakarta.transaction.Transactional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private InvitationsService invitationsService;



    public Project save(Project project) {
        return projectRepository.save(project);
    }
    
    @Transactional
    public Project create(String name, String code, String language) {
        Project project = new Project(name, code, language);
        return projectRepository.save(project);
    }

    public Project getById(UUID id) throws ProjectDoesNotExist {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ProjectDoesNotExist("Project not found with id: " + id));
    }

    public Optional<Project> findById(UUID id) throws ProjectDoesNotExist{
        Optional<Project> projectOpt;
        List<Project> project =  projectRepository.findAllById(Collections.singleton(id));

        if(project.size() == 0) {
            throw new ProjectDoesNotExist("Project with ID: " + id + " does not exist");
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

    public void deleteById(UUID id) {
        projectRepository.deleteAllById(Collections.singleton(id));
    }

    public void removeUser(Project project, User user) {
        project.getUsers().remove(user);
        user.getProjects().remove(project);

        if(project.getUsers().isEmpty()) {
            this.deleteProject(project);
        }
        else {
            projectRepository.save(project);
        }
    }

    public void saveProject(UUID id, String data) throws ProjectDoesNotExist {
        Optional<Project> projectOpt = projectRepository.findById(id);
        projectOpt.orElseThrow(() -> new ProjectDoesNotExist("Project with ID: " + id + " does not exist"));
        
        Project project = projectOpt.get();
        project.setProjectData(data);
        projectRepository.save(project);
 
    }

    public Set<User> getContributers(UUID id) throws ProjectDoesNotExist{
        Optional<Project> project = this.findById(id);
        return project.get().getUsers();
    }

    public void deleteProject(Project project) {
        List<Invitations> inviteList = invitationsService.getInviteByProjectId(project.getId());
        for(Invitations invite : inviteList) {
            invitationsService.deleteInvitation(invite);
        }
        projectRepository.delete(project);
    }


}
