package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.JobPosting;
import com.example.demo.service.JobService;

@RestController
@RequestMapping("/job")
public class JobController {

    @Autowired
    JobService service;

    @PostMapping("/create")
    public JobPosting create(@RequestBody JobPosting job) {
        return service.create(job);
    }

    @GetMapping("/fetch")
    public List<JobPosting> fetch() {
        return service.fetchAll();
    }

    @GetMapping("/fetchById/{id}")
    public Optional<JobPosting> fetchById(@PathVariable Long id) {
        return service.fetchById(id);
    }
}