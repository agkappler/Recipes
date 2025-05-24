package com.recipes.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
	protected static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorModel> handleBadRequest(IllegalArgumentException ex) {
    	logger.error(ex.getMessage());
        return new ResponseEntity<ErrorModel>(new ErrorModel("Invalid input: " + ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorModel> handleGeneric(Exception ex) {
    	logger.error(ex.getMessage());
        return new ResponseEntity<ErrorModel>(new ErrorModel(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

