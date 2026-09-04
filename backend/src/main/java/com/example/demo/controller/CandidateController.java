package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CandidateProfileDto;
import com.example.demo.entity.CandidateProfile;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.CandidateProfileRepository;
import com.example.demo.repository.SystemUserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin("*")
public class CandidateController {

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private SystemUserRepository userRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<CandidateProfile> getMyProfile(Authentication authentication) {
        SystemUser user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<CandidateProfile> updateMyProfile(
            @Valid @RequestBody CandidateProfileDto dto,
            Authentication authentication) {

        SystemUser user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        profile.setResumeUrl(dto.getResumeUrl());
        profile.setPrimarySkill(dto.getPrimarySkill());
        profile.setYearsExperience(dto.getYearsExperience());

        candidateProfileRepository.save(profile);

        return ResponseEntity.ok(profile);
    }
}