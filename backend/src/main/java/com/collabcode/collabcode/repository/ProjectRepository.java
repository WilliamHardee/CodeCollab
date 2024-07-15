package com.collabcode.collabcode.repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.collabcode.collabcode.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID>{

    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = ?1")
    public Optional<List<Project>> getProjectsById(Integer user_id);
}
