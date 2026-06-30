package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.JobApplication;
import com.example.demo.service.RecruitmentService;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    @Autowired
    RecruitmentService service;

    @PostMapping("/create")
    public JobApplication create(@RequestBody JobApplication application) {
        return service.create(application);
    }

    @GetMapping("/fetch")
    public List<JobApplication> fetch() {
        return service.fetchAll();
    }

    @GetMapping("/fetchById/{id}")
    public Optional<JobApplication> fetchById(@PathVariable Long id) {
        return service.fetchById(id);
    }
}