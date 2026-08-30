package com.example.demo.exception;

public class ApplicationCapacityExceededException extends RuntimeException {
    public ApplicationCapacityExceededException(String message) {
        super(message);
    }
}