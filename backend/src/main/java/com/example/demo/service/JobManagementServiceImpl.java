package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.JobPosting;
import com.example.demo.repository.JobPostingRepository;

import jakarta.transaction.Transactional;

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

        existing.setJobTitle(job.getJobTitle());
        existing.setCompany(job.getCompany());
        existing.setLocation(job.getLocation());
        existing.setDescription(job.getDescription());
        existing.setSalary(job.getSalary());

        return jobRepository.save(existing);
    }

    @Override
    public void deleteJob(Long id) {

        if(!jobRepository.existsById(id)) {
            throw new RuntimeException("Job Not Found");
        }

        jobRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void checkAndCloseJob(Long jobId) {

        JobPosting job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job Not Found"));

        /*
         * SRS:
         * Evaluate hiring goal and update status to CLOSED.
         *
         * Add these fields to JobPosting if required:
         * private Integer hiringGoal;
         * private Integer currentFills;
         * private String status;
         */

        /*
        if(job.getCurrentFills() >= job.getHiringGoal()){
            job.setStatus("CLOSED");
            jobRepository.save(job);
        }
        */
    }

}