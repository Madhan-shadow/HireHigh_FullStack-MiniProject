package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    /*
     * ============================================================
     * GET ALL APPLICATIONS
     * Recruiter / TA Lead
     * ============================================================
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<Page<JobApplication>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String stage) {

        Pageable pageable = PageRequest.of(page, size);

        Page<JobApplication> applications;

        if (stage != null && !stage.isBlank()) {

            try {
                applications = applicationRepository
                        .findByCurrentStage(
                                com.example.demo.entity.ApplicationStage
                                        .valueOf(stage.toUpperCase()),
                                pageable
                        );
            } catch (IllegalArgumentException e) {
                applications = Page.empty(pageable);
            }

        } else {
            applications = applicationRepository.findAll(pageable);
        }

        return ResponseEntity.ok(applications);
    }

    /*
     * ============================================================
     * GET MY APPLICATIONS
     * Candidate
     * ============================================================
     */
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<JobApplication>> getMyApplications(
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                recruitmentService.getApplicationsByUsername(username)
        );
    }

    /*
     * ============================================================
     * GET APPLICATION BY ID
     * Recruiter / TA Lead
     * ============================================================
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<JobApplication> getApplication(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                applicationRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException("Application Not Found")
                        )
        );
    }

    /*
     * ============================================================
     * APPLY TO JOB
     * Candidate
     * ============================================================
     */
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Map<String, String>> apply(
            @PathVariable Long jobId,
            Authentication authentication) {

        String username = authentication.getName();

        recruitmentService.apply(jobId, username);

        Map<String, String> response = new HashMap<>();
        response.put(
                "message",
                "Application submitted successfully."
        );

        return ResponseEntity.ok(response);
    }

    /*
     * ============================================================
     * UPDATE APPLICATION STAGE
     * Recruiter / TA Lead
     * ============================================================
     */
    @PutMapping("/{id}/stage")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<Void> updateStage(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String stage = request.get("stage");

        if (stage == null || stage.isBlank()) {
            throw new RuntimeException("Stage is required");
        }

        recruitmentService.updateStage(
                id,
                stage
        );

        return ResponseEntity.ok().build();
    }

    /*
     * ============================================================
     * DELETE APPLICATION
     * Recruiter / TA Lead
     * ============================================================
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable Long id) {

        recruitmentService.deleteApplication(id);

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Application deleted successfully."
        );

        return ResponseEntity.ok(response);
    }
}