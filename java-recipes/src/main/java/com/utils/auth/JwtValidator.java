package com.utils.auth;

import io.jsonwebtoken.JwtException;

public interface JwtValidator {
	/**
     * Validates the token and returns the subject (e.g., user ID or email).
     */
    String validateToken(String token) throws JwtException;
}
