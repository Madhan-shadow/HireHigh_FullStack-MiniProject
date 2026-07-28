package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.example.demo.entity.JobPosting;
import com.example.demo.repository.JobPostingRepository;

@Service
public class JobManagementServiceImpl implements JobManagementService {

    @Autowired
    private JobPostingRepository jobRepository;

    @Override
    public List<JobPosting> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public JobPosting createJob(JobPosting job) {
        return jobRepository.save(job);
    }

    @Override
    public JobPosting updateJob(Long id, JobPosting job) {

    JobPosting existing = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job Not Found"));

    existing.setTitle(job.getTitle());
    existing.setDepartment(job.getDepartment());
    existing.setDescription(job.getDescription());
    existing.setHiringGoal(job.getHiringGoal());
    existing.setCurrentFills(job.getCurrentFills());
    existing.setStatus(job.getStatus());

    return jobRepository.save(existing);
    }

    @Override
    public void deleteJob(@NonNull Long id) {
        jobRepository.deleteById(id);
    }

    @Override
    public void checkAndCloseJob(Long jobId) {
        // Not required for Swagger demo
    }
}