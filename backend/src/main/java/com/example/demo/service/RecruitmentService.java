package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.JobApplication;
import com.example.demo.repository.JobApplicationRepository;

@Service
public class RecruitmentService {

    @Autowired
    JobApplicationRepository repo;

    public JobApplication create(JobApplication application) {
        return repo.save(application);
    }

    public List<JobApplication> fetchAll() {
        return repo.findAll();
    }

    public Optional<JobApplication> fetchById(Long id) {
        return repo.findById(id);
    }
}