package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class CandidateProfile {
    @Id
    private Long id;

    @OneToOne
    private SystemUser user;

    private String resumeUrl;

    private String primarySkill;

    private Integer yearsExperience;

    
}
