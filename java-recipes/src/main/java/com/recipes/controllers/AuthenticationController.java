package com.recipes.controllers;

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

import com.AppConfigProperties;
import com.recipes.dto.AuthRequest;
import com.recipes.dto.AuthResponse;
import com.recipes.dto.Message;
import com.recipes.models.User;
import com.recipes.services.UserService;
import com.utils.auth.JwtUtil;
import com.utils.exceptions.ObjectNotFoundException;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {
	protected static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
	
	private UserService userService;
	private JwtUtil jwtUtil;
	private final AppConfigProperties appConfig;

    @Autowired
    public AuthenticationController(UserService userService, JwtUtil jwtUtil, AppConfigProperties appConfig){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.appConfig = appConfig;
    }
    
    @PostMapping("/authenticateUser")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest, HttpServletResponse response) throws Exception {
    	String email = authRequest.getEmail();
    	String password = authRequest.getPassword();
    	
    	logger.info("Authentication endpoint, email: " + email + " " + password);
    	if (email == null || password == null) {
    		throw new ObjectNotFoundException("Invalid User Request");
    	}
		User user = userService.authenticateUser(email, password);
		logger.info("Authenticated user.");
		
		AuthResponse authResponse = new AuthResponse();
		authResponse.setUser(user);
		String token = this.jwtUtil.generateToken(email);
		logger.info("Generated token for user.");
		
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
    
    @GetMapping("/test-cookie")
    public ResponseEntity<Void> testCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("test", "123")
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(Duration.ofMinutes(10))
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }

}
