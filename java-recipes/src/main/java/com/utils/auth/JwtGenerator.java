package com.utils.auth;

import lombok.NoArgsConstructor;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.AppConfigProperties;
import com.utils.data.SecretManager;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
@NoArgsConstructor
public class JwtGenerator {
    private final long expirationMs = 3600000; // 1 hour
    
    @Autowired
    AppConfigProperties appConfig;

    public String generateToken(String email) throws JwtException {
//    	return "heres a token";
    	String secretKey = this.appConfig.isUseAwsSecrets()
    			? SecretManager.getSecret(this.appConfig.getJwtSecretName(), this.appConfig.getAwsSecretRegion())
				: this.appConfig.getLocalJwtKey();
        String token = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
//        System.out.println(token);
        return token;
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
