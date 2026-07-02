package com.example.demo.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.JobApplication;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>{
    Optional<JobApplication> findById(Long id);

List<JobApplication> findByCandidateUserEmail(String email);

boolean existsByCandidateCandidateIdAndJobJobId(
        Long candidateId,
        Long jobId);
}
