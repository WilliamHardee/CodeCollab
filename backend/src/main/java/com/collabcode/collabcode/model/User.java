package com.collabcode.collabcode.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    @Size(min = 5, message = "password must be longer than 5 characters")
    @NotNull(message = "password cannot be empty")
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User() {

    }

    public void setId(Integer id) {
        this.id = id;
    }
    public void setUserName(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getId() {
        return this.id;
    }
    public String getUsername() {
        return this.username;
    }
    public String getPassword() {
        return this.password;
    }
    
}
