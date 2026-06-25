// package com.example.demo.entity;

// import java.time.LocalDateTime;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.PrePersist;
// import jakarta.persistence.Table;

// @Entity
// @Table(name="JobApplication")
// public class JobApplication {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(fetch = FetchType.LAZY) 
//     @JoinColumn(name = "job_id", nullable = false)
//     private JobPosting job;

//     @ManyToOne(fetch = FetchType.LAZY) 
//     @JoinColumn(name = "candidate_id",nullable = false)
//     private CandidateProfile candidate;

//     @Column(name = "current_Stage", nullable = false)
//     private String currentStage;

//     @Column(name = "applied_at",nullable = false)
//     private LocalDateTime appliedAt;

//     @PrePersist
//     protected void onCreate() {
//         appliedAt = LocalDateTime.now();
//     }

//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public JobPosting getJob() {
//         return job;
//     }

//     public void setJob(JobPosting job) {
//         this.job = job;
//     }

//     public CandidateProfile getCandidate() {
//         return candidate;
//     }

//     public void setCandidate(CandidateProfile candidate) {
//         this.candidate = candidate;
//     }

//     public String getCurrentStage() {
//         return currentStage;
//     }

//     public void setCurrentStage(String currentStage) {
//         this.currentStage = currentStage;
//     }

//     public LocalDateTime getAppliedAt() {
//         return appliedAt;
//     }

//     public void setAppliedAt(LocalDateTime appliedAt) {
//         this.appliedAt = appliedAt;
//     }

//     public JobApplication() {
//     }

//     public JobApplication(Long id, JobPosting job, CandidateProfile candidate, String currentStage,
//             LocalDateTime appliedAt) {
//         this.id = id;
//         this.job = job;
//         this.candidate = candidate;
//         this.currentStage = currentStage;
//         this.appliedAt = appliedAt;
//     }



// }
