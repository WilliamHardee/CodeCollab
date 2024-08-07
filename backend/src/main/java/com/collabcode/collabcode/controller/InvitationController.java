package com.collabcode.collabcode.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.collabcode.DTO.AcceptInvitationDTO;
import com.collabcode.collabcode.DTO.UpdateInvitationDTO;
import com.collabcode.collabcode.model.Invitations;
import com.collabcode.collabcode.service.InvitationsService;
import com.collabcode.collabcode.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
@RequestMapping("/invitation")
public class InvitationController {

    @Autowired
    InvitationsService invitationsService;

    @PostMapping("/create")
    public ResponseEntity createInvitation(@Valid @RequestBody UpdateInvitationDTO createInvitationDTO) throws Exception {
        invitationsService.addInvitation(createInvitationDTO.getInvited_username(), 
                                        createInvitationDTO.getProject_id(),
                                        createInvitationDTO.getInviter_username());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201));
    }

    @DeleteMapping("/delete")
    public ResponseEntity deleteInvitation(@Valid @RequestBody  UpdateInvitationDTO deleteInvitationDTO) throws Exception {
        invitationsService.deleteInvitation(deleteInvitationDTO.getInvited_username(), deleteInvitationDTO.getProject_id(), deleteInvitationDTO.getInviter_username());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("status", 204));
    }

    @PostMapping("/accept")
    public ResponseEntity acceptInvitation(@Valid @RequestBody AcceptInvitationDTO acceptInvitationDTO) throws Exception {
        invitationsService.acceptInvitation(acceptInvitationDTO.getUsername(), acceptInvitationDTO.getProjectID());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201));
    }

    @GetMapping("/{username}")
    public ResponseEntity getByUsername(@PathVariable("username") String username)  throws Exception{
        List<Invitations> inviteList = invitationsService.getInvitations(username);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200, "invitations", inviteList));

    }

   

    
}
