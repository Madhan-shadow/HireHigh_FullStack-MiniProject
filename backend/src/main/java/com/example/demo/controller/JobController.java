package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.JobPosting;
import com.example.demo.service.JobManagementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin("*")
public class JobController {

    @Autowired
    private JobManagementService jobService;

    @GetMapping
    public ResponseEntity<List<JobPosting>> getAllJobs() {

        return ResponseEntity.ok(jobService.getAllJobs());

    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<JobPosting> createJob(@Valid @RequestBody JobPosting job){

        return ResponseEntity.ok(jobService.createJob(job));
        
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<JobPosting> updateJob(@PathVariable Long id,@Valid @RequestBody JobPosting job){

        return ResponseEntity.ok(jobService.updateJob(id, job));

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER','TA_LEAD')")
    public ResponseEntity<Map<String,String>> deleteJob(@PathVariable Long id){

        jobService.deleteJob(id);

        Map<String,String> response = new HashMap<>();
        response.put("message","Job deleted successfully");

        return ResponseEntity.ok(response);

    }

}