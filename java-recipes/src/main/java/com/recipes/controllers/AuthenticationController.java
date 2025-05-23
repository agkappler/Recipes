package com.recipes.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recipes.dto.AuthRequest;
import com.recipes.dto.AuthResponse;
import com.recipes.models.User;
import com.recipes.services.UserService;
import com.utils.auth.JwtGenerator;
import com.utils.exceptions.ObjectNotFoundException;

@RestController
public class AuthenticationController {
	private UserService userService;
	private JwtGenerator jwtGenerator;

    @Autowired
    public AuthenticationController(UserService userService, JwtGenerator jwtGenerator){
        this.userService = userService;
        this.jwtGenerator = jwtGenerator;
    }
    
    @PostMapping("/authenticateUser")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest) throws Exception {
    	String email = authRequest.getEmail();
    	String password = authRequest.getPassword();
    	
    	System.out.println("Authentication endpoint, email: " + email + " " + password);
    	if (email == null || password == null) {
    		throw new ObjectNotFoundException("Invalid User Request");
    	}
		User user = userService.authenticateUser(email, password);
		
		System.out.println("Authenticated");
		AuthResponse response = new AuthResponse();
		response.setUser(user);
		response.setToken(this.jwtGenerator.generateToken(email));
		System.out.println("Returning");
		
		return ResponseEntity.ok(response);
    }
}
