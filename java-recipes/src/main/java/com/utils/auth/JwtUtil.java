package com.utils.auth;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.AppConfigProperties;
import com.utils.data.SecretManager;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor
public class JwtUtil implements JwtValidator {
    private final long expirationHourMs = 3600000; // 1 hour
//    private final long expirationDayMs = 86400000;
    private final String ISSUER = "java-recipes";
    
    @Autowired
    AppConfigProperties appConfig;

    public String generateToken(String email) throws JwtException {
    	String jwtKey = this.appConfig.isUseAwsSecrets()
    			? SecretManager.getSecret(this.appConfig.getJwtSecretName(), this.appConfig.getAwsSecretRegion())
				: this.appConfig.getLocalJwtKey();
    	SecretKey secretKey = Keys.hmacShaKeyFor(jwtKey.getBytes(StandardCharsets.UTF_8));
        String token = Jwts.builder()
                    .setSubject(email)
                    .setIssuer(ISSUER)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + expirationHourMs)) // 1 day
                    .signWith(secretKey)
                    .compact();
        return token;
    }

     public String validateToken(String token) {
    	 String jwtKey = this.appConfig.isUseAwsSecrets()
 			? SecretManager.getSecret(this.appConfig.getJwtSecretName(), this.appConfig.getAwsSecretRegion())
			: this.appConfig.getLocalJwtKey();
    	 SecretKey secretKey = Keys.hmacShaKeyFor(jwtKey.getBytes(StandardCharsets.UTF_8));
    	 Claims claims = Jwts.parserBuilder()
    			    .setSigningKey(secretKey)
    			    .build()
    			    .parseClaimsJws(token)
    			    .getBody();
    	 
    	 String issuer = claims.getIssuer();
    	 if (!ISSUER.equals(issuer)) {
    	     throw new JwtException("Invalid issuer: " + issuer);
    	 }

    	 return claims.getSubject();
     }
     
     public Duration getJwtDuration() {
    	 return Duration.ofHours(1);
     }
}
