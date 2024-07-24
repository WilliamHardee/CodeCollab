package com.collabcode.collabcode.DTO;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public class SaveProjectDTO {
    @NotBlank(message = "Project ID is required")
    private UUID projectId;

    @NotBlank(message = "Project Data is required")
    private String projectData;

    // Constructor
    public SaveProjectDTO(UUID projectId, String projectData) {
        this.projectId = projectId;
        this.projectData = projectData;
       
    }

    // Getters
    public UUID getProjectID() { return this.projectId; }
    public String getProjectData() { return this.projectData; }


    // toString method
    @Override
    public String toString() {
        return "CreateProjectDTO{" +
                "projectID='" + this.projectId + '\'' +
                ", projectData='" + projectData + '\'' +
                '}';
    }
}