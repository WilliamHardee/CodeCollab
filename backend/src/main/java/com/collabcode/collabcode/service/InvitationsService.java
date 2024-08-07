package com.collabcode.collabcode.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.exceptions.InvalidLoginCredentials;
import com.collabcode.collabcode.exceptions.InvitationAlreadyExistsException;
import com.collabcode.collabcode.exceptions.ProjectDoesNotExist;
import com.collabcode.collabcode.exceptions.UserDoesNotExist;
import com.collabcode.collabcode.model.Invitations;
import com.collabcode.collabcode.model.InvitationsId;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.InvitationsRepository;
import com.collabcode.collabcode.repository.ProjectRepository;

@Service
public class InvitationsService {

    @Autowired
    InvitationsRepository invitationsRepository;

    @Autowired
    UserService userService;

    @Autowired
    ProjectService projectService;

    @Autowired
    AuthorizationService authorizationService;



    public void addInvitation(String username, UUID project_id, String inviter_username) throws UserDoesNotExist, ProjectDoesNotExist, InvitationAlreadyExistsException, InvalidLoginCredentials{
        
        Optional<User> user = userService.getUserByUsername(username);
        Optional<Project> project = projectService.findById(project_id);

        user.orElseThrow(() -> new UserDoesNotExist("User with username: " + username + " does not exist"));
        project.orElseThrow(() -> new ProjectDoesNotExist("Project with id: " + project_id + " does not exist"));
        
        User authedUser = authorizationService.getCurrentUser();

        if(authedUser == null || !authedUser.getUsername().equals(inviter_username) || !project.get().getUsers().contains(authedUser)) {
            throw new InvalidLoginCredentials("Not authorized");
        }

        if(project.get().getUsers().contains(user.get())) {
            throw new InvalidLoginCredentials("User already exists in project");
        }

        Optional<Invitations> check = invitationsRepository.findById(new InvitationsId(project_id, user.get()));
        if(check.isPresent()) {
            throw new InvitationAlreadyExistsException("User already has an invitation for this project");
        }

        Invitations invitation = new Invitations(new InvitationsId(project_id, user.get()), inviter_username);
        user.get().addInvitation(invitation);

        userService.save(user.get());
    }

    public void deleteInvitation(String username, UUID project_id, String deleter) throws UserDoesNotExist, ProjectDoesNotExist, InvalidLoginCredentials{
        Optional<User> user = userService.getUserByUsername(username);
        Optional<Project> project = projectService.findById(project_id);

        user.orElseThrow(() -> new UserDoesNotExist("User with username: " + username + " does not exist"));
        project.orElseThrow(() -> new ProjectDoesNotExist("Project with id: " + project_id + " does not exist"));

         
        User authedUser = authorizationService.getCurrentUser();

        if(authedUser == null || !authedUser.getUsername().equals(deleter) || !project.get().getUsers().contains(authedUser)) {
            throw new InvalidLoginCredentials("Not authorized");
        }

        Optional<Invitations> invitation = invitationsRepository.findById(new InvitationsId(project_id, user.get()));
        if(invitation.isEmpty()) {
            return;
        }
        user.get().removeInvitation(invitation.get());
        userService.save(user.get());
    }

    public void acceptInvitation(String username, UUID project_id) throws UserDoesNotExist, ProjectDoesNotExist, Exception, InvalidLoginCredentials{
        Optional<User> user = userService.getUserByUsername(username);
        Optional<Project> project = projectService.findById(project_id);

        user.orElseThrow(() -> new UserDoesNotExist("User with username: " + username + " does not exist"));
        project.orElseThrow(() -> new ProjectDoesNotExist("Project with id: " + project_id + " does not exist"));

         
        User authedUser = authorizationService.getCurrentUser();

        if(authedUser == null || !authedUser.getUsername().equals(username)) {
            throw new InvalidLoginCredentials("Not authorized");
        }

        Optional<Invitations> invitation = invitationsRepository.findById(new InvitationsId(project_id, user.get()));
        if(invitation.isEmpty()) {
            throw new Exception("Accepting non-existant invitation");
        }
        user.get().removeInvitation(invitation.get());
        user.get().addProject(project.get());
        userService.save(user.get());

    }

    public List<Invitations> getInvitations(String username) throws InvalidLoginCredentials {
          
        User authedUser = authorizationService.getCurrentUser();

        if(authedUser == null || !authedUser.getUsername().equals(username)) {
            throw new InvalidLoginCredentials("Not authorized");
        }

        Optional<List<Invitations>> inviteList = invitationsRepository.getInvitationsByUsername(username);
        
        if(inviteList.isEmpty()) {
            return Collections.emptyList();
        }
        return inviteList.get();
        
    }

    

}
