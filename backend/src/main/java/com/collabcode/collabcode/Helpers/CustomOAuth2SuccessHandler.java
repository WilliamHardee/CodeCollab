package com.collabcode.collabcode.Helpers;
import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.repository.UserRepository;
import com.collabcode.collabcode.service.JwtService;
import com.collabcode.collabcode.service.UserDetailsServiceImpl;
import com.collabcode.collabcode.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

    

        String email = oAuth2User.getAttribute("email");


        Optional<User> user = userRepository.getUserByUsername(email);
        if(user.isEmpty()) {
            User newUser = new User();
            newUser.setUsername(email);
            newUser.setPassword(null);
            newUser.setAccountType("OAUTH2");
            userRepository.save(newUser);
        }

        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(email);
        UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities()
        );

        
        SecurityContextHolder.getContext().setAuthentication(newAuth);


        String token = jwtService.GenerateToken(userDetails.getUsername());

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
            .httpOnly(true)  
            .secure(false)
            .path("/")
            .maxAge(3600)
            .sameSite("Lax")
            .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        String frontendRedirectUrl = "http://localhost:5173/projectList"; 
        getRedirectStrategy().sendRedirect(request, response, frontendRedirectUrl);
    }
}