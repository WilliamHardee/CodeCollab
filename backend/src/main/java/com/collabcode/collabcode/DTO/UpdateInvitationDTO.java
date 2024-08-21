package com.collabcode.collabcode.DTO;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateInvitationDTO {
    @NotBlank(message = "inviter username is required")
    private String username;


    @NotNull(message = "project id is required")
    private UUID project_id;

    public UpdateInvitationDTO(String username, UUID project_id) {
        this.username = username;
        this.project_id = project_id;
    }

    public String getUsername() {
        return username;
    }

    public UUID getProject_id() {
        return project_id;
    }
}
