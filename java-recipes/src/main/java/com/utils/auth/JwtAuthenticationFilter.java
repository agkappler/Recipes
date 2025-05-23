package com.utils.auth;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final JwtValidator jwtValidator;

    public JwtAuthenticationFilter(JwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
    }

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
//		String authHeader = request.getHeader("Authorization");
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//            try {
//                String userId = jwtValidator.validateToken(token);
//                UsernamePasswordAuthenticationToken auth =
//                    new UsernamePasswordAuthenticationToken(userId, null, List.of());
//                SecurityContextHolder.getContext().setAuthentication(auth);
//            } catch (JwtException e) {
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                return;
//            }
//        }
        filterChain.doFilter(request, response);

	}

}
