package com.collabcode.collabcode.DTO;

import java.util.UUID;

public class InviteListResponseDTO {
    private String invited_username;
    private String inviter_username;
    private String project_name;
    private UUID project_id;

    public InviteListResponseDTO() {}

    public InviteListResponseDTO(String invited_username, String inviter_username, String project_name, UUID project_id) {
        this.invited_username = invited_username;
        this.inviter_username = inviter_username;
        this.project_name = project_name;
        this.project_id = project_id;
    }

    public String getInvited_username() {
        return invited_username;
    }

    public void setInvited_username(String invited_username) {
        this.invited_username = invited_username;
    }

    public String getInviter_username() {
        return inviter_username;
    }

    public void setInviter_username(String inviter_username) {
        this.inviter_username = inviter_username;
    }

    public String getProject_name() {
        return project_name;
    }

    public void setProject_name(String project_name) {
        this.project_name = project_name;
    }

    public UUID getProject_id() {
        return project_id;
    }

    public void setProject_id(UUID project_id) {
        this.project_id = project_id;
    }

    @Override
    public String toString() {
        return "InviteListResponseDTO{" +
                "invited_username='" + invited_username + '\'' +
                ", inviter_username='" + inviter_username + '\'' +
                ", project_name='" + project_name + '\'' +
                ", project_id=" + project_id +
                '}';
    }
}