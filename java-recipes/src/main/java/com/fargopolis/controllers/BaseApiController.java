package com.fargopolis.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fargopolis.services.PermissionsService;

@RequestMapping("/api")
public class BaseApiController {
	protected static final Logger logger = LoggerFactory.getLogger(BaseApiController.class);

    @Autowired
    protected PermissionsService permissions;
}
