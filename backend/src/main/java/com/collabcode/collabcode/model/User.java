package com.collabcode.collabcode.model;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.hibernate.annotations.ManyToAny;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name = "username", unique = true)
    @Size(min = 5, message = "username must be longer than 5 characters")
    @Size(max = 30, message = "username must be shorter than 30 characters")
    @NotNull(message = "username cannot be empty")
    private String username;

    @Column(name="password")
    private String password;


    private String accountType;

    @ManyToMany
    @JoinTable(name = "user_to_projects", 
        joinColumns = @JoinColumn(name="user_id"),
        inverseJoinColumns = @JoinColumn(name = "project_id"))
    Set<Project> projects = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<UserRole> roles = new HashSet<>();

    @JsonBackReference
    @OneToMany(mappedBy = "invitationId.user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Invitations> invitations = new ArrayList<>();

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User() {

    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setAccountType(String type) {
        this.accountType = type;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void addProject(Project project) {
        this.projects.add(project);
    }

    public void removeProject(Project project) {
        this.projects.remove(project);
        project.getUsers().remove(this);
    }

    public Integer getId() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }

    public String getAccountType(String type) {
        return this.accountType;
    }

    public String getPassword() {
        return this.password;
    }

    public Set<Project> getProjects() {
        return this.projects;
    }

    public Set<UserRole> getRoles() {
        return this.roles;
    }

    public List<Invitations> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Invitations> invitations) {
        this.invitations = invitations;
    }

    public void addInvitation(Invitations invitation) {
        invitations.add(invitation);
        invitation.setUser(this);
    }

    public void removeInvitation(Invitations invitation) {
        invitations.remove(invitation);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
    
    
}
