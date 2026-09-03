package com.example.demo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByCandidateUserUsername(String username);

    Page<JobApplication> findAll(Pageable pageable);

    long countByJobIdAndCurrentStage(Long jobId, String stage);

    // ADD THIS ONE
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
}