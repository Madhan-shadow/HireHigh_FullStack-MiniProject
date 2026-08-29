package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    public void register(RegisterDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        SystemUser user = new SystemUser();

        user.setUsername(dto.getEmail());
        user.setFullname(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());

        user = userRepository.save(user);

        if (dto.getRole() == Role.CANDIDATE) {

            CandidateProfile profile = new CandidateProfile();
            profile.setUser(user);

            candidateRepository.save(profile);
        }
    }

    @Override
    public AuthResponseDto login(AuthRequestDto dto) {

        Optional<SystemUser> optional =
                userRepository.findByEmail(dto.getEmail());

        if (optional.isEmpty()) {
            throw new RuntimeException("Invalid Email");
        }

        SystemUser user = optional.get();

        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        AuthResponseDto response = new AuthResponseDto();

        response.setMessage("Login Successful");
        response.setToken(token);

        // IMPORTANT FOR T26
        response.setRole(user.getRole().name());

        return response;
    }
}