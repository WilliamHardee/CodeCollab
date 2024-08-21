package com.collabcode.collabcode.controller;

import java.security.Principal;
import java.util.ArrayList;
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

import com.collabcode.collabcode.DTO.InviteListResponseDTO;
import com.collabcode.collabcode.DTO.UpdateInvitationDTO;
import com.collabcode.collabcode.model.Invitations;
import com.collabcode.collabcode.service.InvitationsService;
import com.collabcode.collabcode.service.ProjectService;

import jakarta.validation.Valid;

@RestController

@RequestMapping("/invitation")
public class InvitationController {

    @Autowired
    InvitationsService invitationsService;

    @Autowired
    ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity createInvitation(@Valid @RequestBody UpdateInvitationDTO createInvitationDTO, Principal principal) throws Exception {
        invitationsService.addInvitation(createInvitationDTO.getUsername(), 
                                        createInvitationDTO.getProject_id(),
                                        principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201));
    }

    @DeleteMapping("/delete")
    public ResponseEntity deleteInvitation(@Valid @RequestBody  UpdateInvitationDTO deleteInvitationDTO, Principal principal) throws Exception {
        invitationsService.deleteInvitation(deleteInvitationDTO.getUsername(), deleteInvitationDTO.getProject_id(), principal.getName());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("status", 204));
    }

    @PostMapping("/accept/{project_id}")
    public ResponseEntity acceptInvitation(@PathVariable("project_id") UUID project_id, Principal principal) throws Exception {
        invitationsService.acceptInvitation(principal.getName(), project_id);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201));
    }

    @GetMapping("")
    public ResponseEntity getByUsername(Principal principal)  throws Exception{
        List<Invitations> inviteList = invitationsService.getInvitations(principal.getName());
        List<InviteListResponseDTO> res = new ArrayList<>();
        for(Invitations invite : inviteList) {
            InviteListResponseDTO resDTO = new InviteListResponseDTO();
            resDTO.setInvited_username(principal.getName());
            resDTO.setInviter_username(invite.getInviter_username());
            resDTO.setProject_id(invite.getProject_id());
            resDTO.setProject_name(projectService.getById(invite.getProject_id()).getProjectName());
            res.add(resDTO);
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200, "invitations", res));

    }

   

    
}
