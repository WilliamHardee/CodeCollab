package com.collabcode.collabcode.model;

import java.util.UUID;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Invitations")
public class Invitations {

    @EmbeddedId
    private InvitationsId invitationId;

    private String inviter_username;


    public Invitations() {
    }


    public Invitations(InvitationsId invitationId, String inviter_username) {
        this.invitationId = invitationId;
        this.inviter_username = inviter_username;
    }

    public UUID getProject_id() {
        return invitationId.getProject_id();
    }

    public void setProject_id(UUID project_id) {
        if (this.invitationId == null) {
            this.invitationId = new InvitationsId();
        }
        this.invitationId.setProject_id(project_id);
    }

    public User getUser() {
        return invitationId.getUser();
    }

    public void setUser(User user) {
        if (this.invitationId == null) {
            this.invitationId = new InvitationsId();
        }
        this.invitationId.setUser(user);
    }


    public String getInviter_username() {
        return inviter_username;
    }

    public void setInviter_username(String inviter_username) {
        this.inviter_username = inviter_username;
    }

    public InvitationsId getInvitationId() {
        return invitationId;
    }

    public void setInvitationId(InvitationsId invitationId) {
        this.invitationId = invitationId;
    }
}