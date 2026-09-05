package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name="CandidateProfile")
public class CandidateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private SystemUser user;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String resumeUrl;

    private String primarySkill;

    private Integer yearsExperience;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String photoUrl;

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SystemUser getUser() {
        return user;
    }

    public void setUser(SystemUser user) {
        this.user = user;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getPrimarySkill() {
        return primarySkill;
    }

    public void setPrimarySkill(String primarySkill) {
        this.primarySkill = primarySkill;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public CandidateProfile() {
    }

    public CandidateProfile(Long id, SystemUser user, String resumeUrl, String primarySkill, Integer yearsExperience) {
        this.id = id;
        this.user = user;
        this.resumeUrl = resumeUrl;
        this.primarySkill = primarySkill;
        this.yearsExperience = yearsExperience;
    }

}