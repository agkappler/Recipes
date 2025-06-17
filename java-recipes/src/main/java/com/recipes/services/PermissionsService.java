package com.recipes.services;

import org.springframework.stereotype.Service;

import com.AppConfigProperties;

@Service
public class PermissionsService {
	private final AppConfigProperties appConfig;

    public PermissionsService(AppConfigProperties appConfig) {
        this.appConfig = appConfig;
    }
	
	public boolean canRead() {
		if (this.appConfig.isCanRead()) {
			return true;
		}
		
		throw new SecurityException("You lack the required read permissions.");
	}
	
	public boolean canWrite() {
		if (this.appConfig.isCanWrite()) {
			return true;
		}
		
		throw new SecurityException("You lack the required write permissions.");
	}
	
	public boolean isAuthenticated() {
		return this.appConfig.isCanWrite();
	}
}
