package com.fargopolis.dto;

import com.fargopolis.models.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthResponse {
	private User user;
	private String token;
}
