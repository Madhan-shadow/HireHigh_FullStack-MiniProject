package com.example.demo.repository;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.JobApplication;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>{
    List<JobApplication> findByCandidateUserEmail(String email);

    // boolean existsByCandidateCandidateIdAndJobJobId(
    //         Long candidateId,
    //         Long jobId);
}
