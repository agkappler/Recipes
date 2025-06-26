package com.fargopolis.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fargopolis.dto.AuthRequest;
import com.fargopolis.dto.Message;
import com.fargopolis.services.PermissionsService;
import com.fargopolis.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseApiController {

	private UserService userService;
	private final PermissionsService permissions;

    @Autowired
    public UserController(UserService userService, PermissionsService permissions){
        this.userService = userService;
        this.permissions = permissions;
    }
	
	@PostMapping("/createUser")
    public ResponseEntity<Message> createUser(@RequestBody AuthRequest authRequest) throws Exception {
        permissions.canWrite();
        userService.createUser(authRequest.getEmail(), authRequest.getPassword());

        return ResponseEntity.ok(new Message("Succesfully created user!"));
    }
}
