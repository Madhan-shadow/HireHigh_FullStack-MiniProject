package com.example.demo.dto;

public class UserResponseDto {

    private Long userId;
    private String fullName;
    private String email;
    private String role;

    public UserResponseDto() {
    }

    public UserResponseDto(Long userId, String fullName,
                           String email, String role) {

        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}