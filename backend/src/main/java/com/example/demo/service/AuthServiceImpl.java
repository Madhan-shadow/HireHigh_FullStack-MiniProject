package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.CandidateProfile;
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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Override
    public void register(RegisterDto dto) {

        if(userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        SystemUser user = new SystemUser();

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());

        user = userRepository.save(user);

        if("CANDIDATE".equalsIgnoreCase(dto.getRole())) {

            CandidateProfile profile = new CandidateProfile();

            profile.setUser(user);

            candidateRepository.save(profile);
        }

    }

    @Override
    public AuthResponseDto login(AuthRequestDto dto) {

        Optional<SystemUser> optionalUser =
                userRepository.findByEmail(dto.getEmail());

        if(optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid Email");
        }

        SystemUser user = optionalUser.get();

        if(!passwordEncoder.matches(dto.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        AuthResponseDto response = new AuthResponseDto();

        response.setToken(token);
        response.setMessage("Login Successful");

        return response;

    }

}