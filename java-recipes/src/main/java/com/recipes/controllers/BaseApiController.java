package com.recipes.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

import com.recipes.services.PermissionsService;

@RequestMapping("/api")
public class BaseApiController {

    @Autowired
    protected PermissionsService permissions;
}
