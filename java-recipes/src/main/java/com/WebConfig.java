package com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Autowired
	private ApiRequestInterceptor apiRequestInterceptor;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
	    registry.addInterceptor(apiRequestInterceptor)
	            .addPathPatterns("/**"); // intercept all paths
	}
    
	@Override
	public void addCorsMappings(CorsRegistry registry) {
	    registry.addMapping("/**")
			.allowedOrigins("https://localhost:3000", "https://fargopolis.com", "https://www.fargopolis.com") // Or "*" to allow all
			.allowedMethods("GET", "POST", "PUT", "DELETE")
			.allowCredentials(true)
			.allowedHeaders("*");
	}
}

