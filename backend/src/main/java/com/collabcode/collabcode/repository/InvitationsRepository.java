package com.collabcode.collabcode.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.collabcode.collabcode.model.Invitations;
import com.collabcode.collabcode.model.InvitationsId;

@Repository
public interface InvitationsRepository extends JpaRepository<Invitations, InvitationsId>  {

    @Query("SELECT i FROM Invitations i WHERE i.id.user.username = ?1")
    public Optional<List<Invitations>> getInvitationsByUsername(String username);


    @Query("SELECT i FROM Invitations i WHERE i.id.project_id = ?1")
    public Optional<List<Invitations>> getInvitationsByID(UUID project_id);
    
}
