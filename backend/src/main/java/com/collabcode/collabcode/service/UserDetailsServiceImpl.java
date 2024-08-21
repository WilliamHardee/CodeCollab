package com.collabcode.collabcode.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.collabcode.collabcode.Helpers.CustomUserDetails;

import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService { 

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);

        user.orElseThrow(() -> new UsernameNotFoundException("could not find user: " + username));
        
        return new CustomUserDetails(user.get());
    }

}
