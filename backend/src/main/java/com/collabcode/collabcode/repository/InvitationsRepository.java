package com.collabcode.collabcode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabcode.collabcode.model.Invitations;
import com.collabcode.collabcode.model.InvitationsId;

@Repository
public interface InvitationsRepository extends JpaRepository<Invitations, InvitationsId>  {
    
}
