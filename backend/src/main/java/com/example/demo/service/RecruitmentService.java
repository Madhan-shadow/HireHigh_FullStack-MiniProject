package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.JobApplication;
import com.example.demo.repository.JobApplicationRepository;

@Service
public class RecruitmentService {

    @Autowired
    private JobApplicationRepository repository;

    public JobApplication saveApplication(JobApplication application) {
        return repository.save(application);
    }

    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    public JobApplication getApplicationById(Long id) {
        return repository.findById(id).orElse(null);
    }
}