package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class CandidateProfile {
    @Id
    private Long id;

    private String user;

    private String resumeUrl;

    private String primarySkill;

    private Integer yearsExperience;
    
    
}
