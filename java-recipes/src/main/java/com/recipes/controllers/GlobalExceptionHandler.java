package com.recipes.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorModel> handleBadRequest(IllegalArgumentException ex) {
        return new ResponseEntity<ErrorModel>(new ErrorModel("Invalid input: " + ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorModel> handleGeneric(Exception ex) {
    	System.out.println(ex.getMessage());
        return new ResponseEntity<ErrorModel>(new ErrorModel(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

