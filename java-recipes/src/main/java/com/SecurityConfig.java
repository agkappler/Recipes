package com;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.utils.auth.JwtAuthenticationFilter;
import com.utils.auth.JwtGenerator;
import com.utils.auth.JwtValidator;
import com.utils.auth.LocalJwtValidator;

@Configuration
public class SecurityConfig {
//    @Value("${jwt.secret}")
//    private String jwtSecret;
//
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        JwtValidator validator = new LocalJwtValidator(jwtSecret);
//
        http
            .csrf().disable();
//            .authorizeHttpRequests(auth -> auth
//                .anyRequest().authenticated()
//            )
//            .addFilterBefore(new JwtAuthenticationFilter(validator), UsernamePasswordAuthenticationFilter.class);
//
        return http.build();
    }
}

