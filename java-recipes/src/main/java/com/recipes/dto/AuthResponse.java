package com.recipes.dto;

import com.recipes.models.User;

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
