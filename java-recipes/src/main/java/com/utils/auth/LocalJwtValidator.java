package com.utils.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

public class LocalJwtValidator implements JwtValidator {
	private final String secret;

    public LocalJwtValidator(String secret) {
        this.secret = secret;
    }

	@Override
	public String validateToken(String token) throws JwtException {
		Claims claims = Jwts.parser()
	            .setSigningKey(secret)
	            .parseClaimsJws(token)
	            .getBody();

        return claims.getSubject(); // or whatever claim you want to extract
	}

}
