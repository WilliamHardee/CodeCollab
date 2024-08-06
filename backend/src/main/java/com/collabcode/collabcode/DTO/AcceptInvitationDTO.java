package com.collabcode.collabcode.DTO;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AcceptInvitationDTO {
    @NotBlank(message = "Project ID is required")
    private String username;

    @NotNull(message = "project id is required")
    private UUID project_id;

    public AcceptInvitationDTO(String username, UUID project_id) {
        this.username = username;
        this.project_id = project_id;
       
    }

    public String getUsername() { return this.username; }
    public UUID getProjectID() { return this.project_id; }

}