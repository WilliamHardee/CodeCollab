package com.collabcode.collabcode.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.collabcode.collabcode.exceptions.JwtAuthenticationException;
import com.collabcode.collabcode.service.JwtService;
import com.collabcode.collabcode.service.UserDetailsServiceImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String[] EXCLUDED_PATHS = { "/user/login", "/user/create", "/h2-console/**" };

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        for (String excludedPath : EXCLUDED_PATHS) {
            if (new AntPathMatcher().match(excludedPath, path)) {
                filterChain.doFilter(request, response);
                return;
            }
        }
        try {

            String token = null;
            String username = null;

            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals("jwt")) {
                        token = cookie.getValue();
                    }
                }
                username = jwtService.extractUsername(token);
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

            filterChain.doFilter(request, response);
        } catch (MalformedJwtException | io.jsonwebtoken.security.SecurityException e) {
            handlerExceptionResolver.resolveException(request, response, null,
                    new JwtAuthenticationException("Invalid JWT token", e));
        } catch (ExpiredJwtException e) {
            handlerExceptionResolver.resolveException(request, response, null,
                    new JwtAuthenticationException("Expired JWT token", e));
        } catch (UnsupportedJwtException e) {
            handlerExceptionResolver.resolveException(request, response, null,
                    new JwtAuthenticationException("Unsupported JWT token", e));
        } catch (IllegalArgumentException e) {
            handlerExceptionResolver.resolveException(request, response, null,
                    new JwtAuthenticationException("JWT claims string is empty", e));
        }
    }
}