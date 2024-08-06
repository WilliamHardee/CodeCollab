package com.collabcode.collabcode.DTO;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateInvitationDTO {
    @NotBlank(message = "inviter username is required")
    private String inviter_username;

    @NotBlank(message = "invited username is required")
    private String invited_username;

    @NotNull(message = "project id is required")
    private UUID project_id;

    public UpdateInvitationDTO(String inviter_username, String invited_username, UUID project_id) {
        this.invited_username = invited_username;
        this.inviter_username = inviter_username;
        this.project_id = project_id;
    }

    public String getInviter_username() {
        return inviter_username;
    }

    public String getInvited_username() {
        return invited_username;
    }

    public UUID getProject_id() {
        return project_id;
    }
}
