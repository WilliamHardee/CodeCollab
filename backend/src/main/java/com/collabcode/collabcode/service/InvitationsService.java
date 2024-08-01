package com.collabcode.collabcode.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.exceptions.InvitationAlreadyExistsException;
import com.collabcode.collabcode.exceptions.ProjectDoesNotExist;
import com.collabcode.collabcode.exceptions.UserDoesNotExist;
import com.collabcode.collabcode.model.Invitations;
import com.collabcode.collabcode.model.InvitationsId;
import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.InvitationsRepository;

@Service
public class InvitationsService {

    @Autowired
    InvitationsRepository invitationsRepository;

    @Autowired
    UserService userService;

    @Autowired
    ProjectService projectService;

    public void addInvitation(String username, UUID project_id, String inviter_username) throws UserDoesNotExist, ProjectDoesNotExist, InvitationAlreadyExistsException{
        Optional<User> user = userService.getUserByUsername(username);
        Optional<Project> project = projectService.findById(project_id);

        user.orElseThrow(() -> new UserDoesNotExist("User with username: " + username + " does not exist"));
        project.orElseThrow(() -> new ProjectDoesNotExist("Project with id: " + project_id + " does not exist"));

        Optional<Invitations> check = invitationsRepository.findById(new InvitationsId(project_id, user.get()));
        if(check.isPresent()) {
            throw new InvitationAlreadyExistsException("User already has an invitation for that project");
        }

        Invitations invitation = new Invitations(new InvitationsId(project_id, user.get()), inviter_username);
        user.get().addInvitation(invitation);

        userService.save(user.get());

    }

    public void deleteInvitation(String username, UUID project_id) throws UserDoesNotExist, ProjectDoesNotExist, InvitationAlreadyExistsException{
        Optional<User> user = userService.getUserByUsername(username);
        Optional<Project> project = projectService.findById(project_id);

        user.orElseThrow(() -> new UserDoesNotExist("User with username: " + username + " does not exist"));
        project.orElseThrow(() -> new ProjectDoesNotExist("Project with id: " + project_id + " does not exist"));

        Optional<Invitations> invitation = invitationsRepository.findById(new InvitationsId(project_id, user.get()));
        if(invitation.isEmpty()) {
            return;
        }
        user.get().removeInvitation(invitation.get());
        userService.save(user.get());

    }



}
