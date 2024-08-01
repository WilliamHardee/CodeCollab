package com.collabcode.collabcode.DTO;

import jakarta.validation.constraints.NotBlank;

public class CreateProjectDTO {
    @NotBlank(message = "Project name is required")
    private String projectName;

    @NotBlank(message = "Project data is required")
    private String projectData;

    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Username is required")
    private String username;

    public CreateProjectDTO(String projectName, String projectData, String language, String username) {
        this.projectName = projectName;
        this.projectData = projectData;
        this.language = language;
        this.username = username;
    }


    public String getProjectName() { return projectName; }
    public String getProjectData() { return projectData; }
    public String getLanguage() { return language; }
    public String getUsername() { return username; }

    @Override
    public String toString() {
        return "CreateProjectDTO{" +
                "projectName='" + projectName + '\'' +
                ", projectData='" + projectData + '\'' +
                ", language='" + language + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}