package com.collabcode.collabcode.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateLoginDTO {
    
    @Size(min = 5, message = "username must be longer than 5 characters")
    @Size(max = 30, message = "username must be shorter than 30 characters")
    @NotNull(message = "username cannot be empty")
    private String username;

    @Size(min = 5, message = "password must be longer than 5 characters")
    @Size(max = 30, message = "password must be shorter than 30 characters")
    @NotNull(message = "password cannot be empty")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}