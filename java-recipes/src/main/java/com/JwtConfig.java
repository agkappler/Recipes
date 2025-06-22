package com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.utils.auth.JwtAuthenticationFilter;

@Configuration
public class JwtConfig {
	
	@Autowired
	private JwtAuthenticationFilter jwtFilter;
	
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
        	.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        	.authorizeHttpRequests(auth -> auth
	        	.requestMatchers("/authentication/**").permitAll()
	        	// Allow public access to GETs
	            .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
	            
	            // Require auth for write operations
	            .requestMatchers(HttpMethod.POST, "/api/**").authenticated()
	            .requestMatchers(HttpMethod.PUT, "/api/**").authenticated()
	            .requestMatchers(HttpMethod.DELETE, "/api/**").authenticated()
	            .anyRequest().authenticated()
    		)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}

