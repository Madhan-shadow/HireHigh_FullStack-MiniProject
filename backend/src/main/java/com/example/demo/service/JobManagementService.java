package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.JobPosting;

public interface JobManagementService {

    List<JobPosting> getAllJobs();

    JobPosting createJob(JobPosting job);

    JobPosting updateJob(Long id, JobPosting job);

    void deleteJob(Long id);

    void checkAndCloseJob(Long jobId);

}