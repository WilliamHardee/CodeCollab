package com.collabcode.collabcode.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.Helpers.CustomUserDetails;
import com.collabcode.collabcode.model.User;

@Service
public class AuthorizationService {
    
    public Boolean isCurrentAuthorizedUser(User user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth == null || !auth.isAuthenticated()) {
            return false;
        }

        CustomUserDetails principle = (CustomUserDetails) auth.getPrincipal();
        return principle.getUsername().equals(user.getUsername());
    }

    public String getCurrentUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth == null || !auth.isAuthenticated()) {
            return null;
        }

        CustomUserDetails principle = (CustomUserDetails) auth.getPrincipal();
        return principle.getUsername();
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth == null || !auth.isAuthenticated()) {
            return null;
        }

        CustomUserDetails principle = (CustomUserDetails) auth.getPrincipal();
        return principle.getUser();
    }

}
