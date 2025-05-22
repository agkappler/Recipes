package com.utils.auth;

import lombok.NoArgsConstructor;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
@NoArgsConstructor
public class JwtGenerator {
    private final String secretKey = "qGa3c8MIvwzsrZw+F8HVQK878TDfQKohlBkRxj6GXwa85AlqecSyrg+CyWepJHTyfieXAJkjfd3ZQeLgAUyEIg==";
    private final long expirationMs = 3600000; // 1 hour

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    // public boolean validateToken(String token) {
    // try {
    // Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
    // return true;
    // } catch (JwtException e) {
    // return false;
    // }
    // }
    //
    // public String getEmailFromToken(String token) {
    // return Jwts.parser().setSigningKey(secretKey)
    // .parseClaimsJws(token)
    // .getBody()
    // .getSubject();
    // }
}
