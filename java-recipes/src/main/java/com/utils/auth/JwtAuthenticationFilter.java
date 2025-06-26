package com.utils.auth;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fargopolis.models.User;
import com.fargopolis.services.UserService;
import com.utils.exceptions.ObjectNotFoundException;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	protected static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
	
	private static final List<String> WHITELIST = List.of(
	    "/authentication"
	);
	
	private final UserService userService;
	private final JwtValidator jwtValidator;

    @Autowired
	public JwtAuthenticationFilter(JwtValidator jwtValidator, UserService userService) {
        this.jwtValidator = jwtValidator;
        this.userService = userService;
    }

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String path = request.getRequestURI();
		if (WHITELIST.stream().anyMatch(path::startsWith)) {
	        filterChain.doFilter(request, response);
	        return;
	    }
            
        String token = extractTokenFromCookies(request);
        try {
        	if (token == null || token == "") {
        		throw new JwtException("Token cannot be null or empty.");
        	}
        	
        	String email = jwtValidator.validateToken(token);
        	User user = userService.getUser(email);
            
        	UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
		        user,
		        null,
		        Collections.emptyList()
		    );

    		authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    		SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (JwtException | ObjectNotFoundException | SQLException e) {
            if (requiresAuthentication(request)) {
            	logger.error("Error validating user: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
	}
	
	private String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        return Arrays.stream(request.getCookies())
                .filter(cookie -> "jwt".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
	
	private boolean requiresAuthentication(HttpServletRequest request) {
	    String uri = request.getRequestURI();
	    String method = request.getMethod();

	    // Public endpoints
	    if (uri.startsWith("/authentication")) return false;
	    if ("GET".equalsIgnoreCase(method)) return false;

	    // Everything else requires auth
	    return true;
	}

}

