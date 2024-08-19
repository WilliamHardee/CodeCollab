package com.collabcode.collabcode.Helpers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.UserRepository;
import com.collabcode.collabcode.service.UserDetailsServiceImpl;
import com.collabcode.collabcode.service.UserService;

@Component
public class CustomOAuth2AuthProvider implements AuthenticationProvider  {
    
    @Autowired
    @Lazy
    private UserService userService;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if(authentication instanceof OAuth2AuthenticationToken) {
            System.out.println("Oauth account");
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
            OAuth2User oauth2User = token.getPrincipal();
            String email = oauth2User.getAttribute("email");

            Optional<User> user = userService.getUserByUsername("email");
            user.orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setPassword(null);
                newUser.setAccountType("OAUTH2");
                return userService.save(newUser);
            });

            UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(email);
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        }
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OAuth2AuthenticationToken.class.isAssignableFrom(authentication);
    }
}
