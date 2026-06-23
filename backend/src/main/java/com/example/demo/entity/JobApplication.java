package com.example.demo.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class JobApplication {
    
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "job_id", nullable = false)
    private JobPosting job;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "candidate_id",nullable = false)
    private CandidateProfile candidate;

    @Column(name = "current_Stage", nullable = false)
    private String currentStage;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    

}
