package com.collabcode.collabcode.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.collabcode.collabcode.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{

    @Query("SELECT u FROM User u WHERE username = ?1")
    public Optional<User> findByUsername(String username); 

    @Query("SELECT u.id FROM User u WHERE u.username = ?1")
    public Optional<User> getUserByUsername(String username);
} 
