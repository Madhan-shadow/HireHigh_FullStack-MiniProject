package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.ChangePasswordDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterDto dto) {

        authService.register(dto);

        return new ResponseEntity<>(
                "User Registered Successfully",
                HttpStatus.OK
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody AuthRequestDto dto) {

        return ResponseEntity.ok(authService.login(dto));
    }

    // Requires a valid JWT — must NOT be listed under permitAll() in
    // SecurityConfig, unlike /register and /login.
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordDto dto,
            Authentication authentication) {

        authService.changePassword(authentication.getName(), dto);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully.");
        return ResponseEntity.ok(response);
    }
}