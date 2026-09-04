package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.CandidateProfile;
import com.example.demo.entity.Role;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.CandidateProfileRepository;
import com.example.demo.repository.SystemUserRepository;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private SystemUserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterDto dto) {

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        SystemUser user = new SystemUser();

        user.setUsername(dto.getUsername());
        user.setFullname(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());

        user = userRepository.save(user);

        if (dto.getRole() == Role.CANDIDATE) {

            CandidateProfile profile = new CandidateProfile();
            profile.setUser(user);
            profile.setResumeUrl(dto.getResumeUrl());
            profile.setPrimarySkill(dto.getPrimarySkill());
            profile.setYearsExperience(dto.getYearsExperience());

            // Uncomment the line below once you've added a `photoUrl`
            // field (with getter/setter) to CandidateProfile.java:
            // profile.setPhotoUrl(dto.getPhotoUrl());

            candidateRepository.save(profile);
        }
    }

    @Override
    public AuthResponseDto login(AuthRequestDto dto) {

        Optional<SystemUser> optional =
                userRepository.findByUsername(dto.getUsername());

        if (optional.isEmpty()) {
            throw new RuntimeException("Invalid Username");
        }

        SystemUser user = optional.get();

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getUsername());

        AuthResponseDto response = new AuthResponseDto();

        response.setMessage("Login Successful");
        response.setToken(token);
        response.setRole(user.getRole().name());

        return response;
    }
}