package com.collabcode.collabcode.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.collabcode.DTO.CreateInvitationDTO;
import com.collabcode.collabcode.DTO.DeleteInvitationDTO;
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
    public ResponseEntity createInvitation(@Valid @RequestBody CreateInvitationDTO createInvitationDTO) throws Exception {
        invitationsService.addInvitation(createInvitationDTO.getInvited_username(), 
                                        createInvitationDTO.getProject_id(),
                                        createInvitationDTO.getInviter_username());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", 201));
    }

    @DeleteMapping("/delete")
    public ResponseEntity deleteInvitation(@Valid @RequestBody DeleteInvitationDTO deleteInvitationDTO) throws Exception {
        invitationsService.deleteInvitation(deleteInvitationDTO.getUsername(), deleteInvitationDTO.getProject_id());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("status", 204));
    }
}
