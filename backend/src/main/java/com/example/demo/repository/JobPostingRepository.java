package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.JobPosting;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long>{
    
}
