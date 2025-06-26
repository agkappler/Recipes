package com.fargopolis.controllers;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fargopolis.dto.AuthRequest;
import com.fargopolis.dto.AuthResponse;
import com.fargopolis.dto.Message;
import com.fargopolis.models.User;
import com.fargopolis.services.UserService;
import com.utils.auth.JwtUtil;
import com.utils.exceptions.ObjectNotFoundException;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {
	protected static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
	
	private final UserService userService;
	private final JwtUtil jwtUtil;

    @Autowired
    public AuthenticationController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
    
    @PostMapping("/authenticateUser")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest, HttpServletResponse response) throws Exception {
    	String email = authRequest.getEmail();
    	String password = authRequest.getPassword();

        logger.info("Authentication endpoint, email: {} {}", email, password);
    	if (email == null || password == null) {
    		throw new ObjectNotFoundException("Invalid User Request");
    	}
		User user = userService.authenticateUser(email, password);
		
		AuthResponse authResponse = new AuthResponse();
		authResponse.setUser(user);
		String token = this.jwtUtil.generateToken(email);
		
		response.addHeader(HttpHeaders.SET_COOKIE, getCookieString(token, jwtUtil.getJwtDuration()));
		
		return ResponseEntity.ok(authResponse);
    }
    
    @GetMapping("/logout")
    public ResponseEntity<Message> logout(HttpServletResponse response) {
        response.setHeader(HttpHeaders.SET_COOKIE, getCookieString("", Duration.ZERO));

        return ResponseEntity.ok(new Message("Logged out"));
    }

    private String getCookieString(String token, Duration duration) {
    	ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(duration)
                .build();
    	return cookie.toString();
    }
}
