package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.JobApplication;
import com.example.demo.service.RecruitmentService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private RecruitmentService service;

    @PostMapping
    public JobApplication saveApplication(@RequestBody JobApplication application) {
        return service.saveApplication(application);
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return service.getAllApplications();
    }

    @GetMapping("/{id}")
    public JobApplication getApplicationById(@PathVariable Long id) {
        return service.getApplicationById(id);
    }
}