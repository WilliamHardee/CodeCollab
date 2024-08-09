package com.collabcode.collabcode.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="projects")
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "project must have a name")
    @Size(min = 1, message = "project must have a name")
    private String projectName;

    private String projectData;

    @NotNull(message = "project must have a language")
    @Column(columnDefinition = "VARCHAR(60) CHECK (language IN ('Python', 'Java', 'Cpp', 'Javascript', 'Ruby', 'Php', 'Go', 'Typescript', 'Swift', 'Kotlin', 'Csharp', 'Scala', 'Perl', 'Dart', 'Haskell'))")
    private String language;

    @JsonBackReference
    @ManyToMany(mappedBy = "projects")
    Set<User> users = new HashSet<>();

    public Project() {}

    public Project(String name, String data, String language) {
        this.projectName = name;
        this.projectData = data;
        this.language = language;
    }

    public UUID getId() {
        return id;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getProjectData() {
        return projectData;
    }

    public String getLanguage() {
        return language;
    }

    public Set<User> getUsers() {
        return this.users;
    }


    public void setId(UUID id) {
        this.id = id;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public void setProjectData(String projectData) {
        this.projectData = projectData;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void addUser(User user) {
        this.users.add(user);
    }
}