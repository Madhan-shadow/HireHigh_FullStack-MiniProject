package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.UserProfileResponseDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private SystemUserRepository userRepository;

    // Requires authentication (any role) — must NOT be in permitAll()
    // in SecurityConfig.
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDto> getMyAccount(Authentication authentication) {
        SystemUser user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        UserProfileResponseDto dto = new UserProfileResponseDto(
                user.getId(),
                user.getUsername(),
                user.getFullname(),
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(dto);
    }
}