package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.JobApplication;

public interface RecruitmentService {

    List<JobApplication> getApplicationsByUsername(String username);

    JobApplication apply(Long jobId, String username);

    void updateStage(Long id, String stage);

    void finalizeHiring(Long applicationId);

    void deleteApplication(Long id);

}