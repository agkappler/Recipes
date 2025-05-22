package com.recipes.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recipes.dto.AuthResponse;
import com.recipes.models.User;
import com.recipes.services.UserService;
import com.utils.auth.JwtGenerator;
import com.utils.exceptions.ObjectNotFoundException;

@RestController
public class UserController {
	private UserService userService;
	private JwtGenerator jwtGenerator;

    @Autowired
    public UserController(UserService userService, JwtGenerator jwtGenerator){
        this.userService = userService;
        this.jwtGenerator = jwtGenerator;
    }
    
    @PostMapping("/authenticateUser")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestParam("email") String email, @RequestParam("password") String password) throws Exception {
    	System.out.println("Authentication endpoint");
    	if (email == null || password == null) {
    		throw new ObjectNotFoundException("Invalid User Request");
    	}
		User user = userService.authenticateUser(email, password);
		
		AuthResponse response = new AuthResponse();
		response.setUser(user);
		response.setToken(this.jwtGenerator.generateToken(email));
		
		return ResponseEntity.ok(response);
    }
}
