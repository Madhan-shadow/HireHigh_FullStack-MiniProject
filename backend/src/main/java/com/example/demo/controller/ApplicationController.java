package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.JobApplication;
import com.example.demo.repository.JobApplicationRepository;
import com.example.demo.service.RecruitmentService;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin("*")
public class ApplicationController {

    @Autowired
    private RecruitmentService recruitmentService;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    // FIXED: username taken from the authenticated JWT principal,
    // not a query parameter the frontend never sends.
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<JobApplication>> getMyApplications(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(
                recruitmentService.getApplicationsByUsername(username));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<JobApplication> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(
                applicationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Not Found")));
    }

    // FIXED: this was the root cause of both T21 and T23 failing —
    // @RequestParam String username had no value ever sent by the
    // frontend, so every apply call 400'd before reaching the
    // capacity check or returning the success message.
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Map<String, String>> apply(@PathVariable Long jobId, Authentication authentication) {
        String username = authentication.getName();

        recruitmentService.apply(jobId, username);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Application submitted successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/stage")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<Void> updateStage(@PathVariable Long id, @RequestParam String stage) {
        recruitmentService.updateStage(id, stage);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        recruitmentService.deleteApplication(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Application deleted successfully.");
        return ResponseEntity.ok(response);
    }
}