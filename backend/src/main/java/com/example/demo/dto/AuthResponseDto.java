package com.example.demo.dto;

public class AuthResponseDto {

    private String message;
    private String token;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}