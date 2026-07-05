package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<JobApplication>> getMyApplications(
            @RequestParam String username){

        return ResponseEntity.ok(
                recruitmentService.getApplicationsByUsername(username));

    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getApplication(
            @PathVariable Long id){

        return ResponseEntity.ok(
                applicationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Not Found")));

    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Map<String,String>> apply(
            @PathVariable Long jobId,
            @RequestParam String username){

        recruitmentService.apply(jobId, username);

        Map<String,String> response = new HashMap<>();

        response.put("message","Application Submitted Successfully");

        return ResponseEntity.ok(response);

    }

    @PutMapping("/{id}/stage")
    public ResponseEntity<Void> updateStage(
            @PathVariable Long id,
            @RequestParam String stage){

        recruitmentService.updateStage(id, stage);

        return ResponseEntity.ok().build();

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String,String>> delete(
            @PathVariable Long id){

        recruitmentService.deleteApplication(id);

        Map<String,String> response = new HashMap<>();

        response.put("message","Application deleted successfully.");

        return ResponseEntity.ok(response);

    }

}