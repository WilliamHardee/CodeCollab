package com.collabcode.collabcode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabcode.collabcode.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{

    
} 
