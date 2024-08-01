package com.collabcode.collabcode.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public class InvitationsId implements Serializable {

    private UUID project_id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public InvitationsId() {
    }

    public InvitationsId(UUID project_id, User user) {
        this.project_id = project_id;
        this.user = user;
    }

    public UUID getProject_id() {
        return project_id;
    }

    public void setProject_id(UUID project_id) {
        this.project_id = project_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InvitationsId that = (InvitationsId) o;
        return Objects.equals(project_id, that.project_id) &&
               Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(project_id, user);
    }
}