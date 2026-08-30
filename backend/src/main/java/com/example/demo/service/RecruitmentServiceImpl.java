package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.ApplicationStage;
import com.example.demo.entity.CandidateProfile;
import com.example.demo.entity.JobApplication;
import com.example.demo.entity.JobPosting;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.ApplicationCapacityExceededException;
import com.example.demo.repository.CandidateProfileRepository;
import com.example.demo.repository.JobApplicationRepository;
import com.example.demo.repository.JobPostingRepository;
import com.example.demo.repository.SystemUserRepository;

@Service
public class RecruitmentServiceImpl implements RecruitmentService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private JobPostingRepository jobRepository;

    @Autowired
    private CandidateProfileRepository candidateRepository;

    @Autowired
    private SystemUserRepository userRepository;

    @Override
    public List<JobApplication> getApplicationsByUsername(String username) {

        return applicationRepository.findByCandidateUserUsername(username);

    }

    @Override
    public JobApplication apply(Long jobId, String username) {

        SystemUser user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));

        CandidateProfile candidate = candidateRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Candidate Not Found"));

        JobPosting job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job Not Found"));

        // Check whether the job has reached its hiring capacity
        if (job.getHiringGoal() != null
                && job.getCurrentFills() != null
                && job.getCurrentFills() >= job.getHiringGoal()) {

            throw new ApplicationCapacityExceededException(
                    "Application capacity exceeded for this job");
        }

        JobApplication application = new JobApplication();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setCurrentStage(ApplicationStage.APPLIED);

        return applicationRepository.save(application);
    }

    @Override
    public void updateStage(Long id, String stage) {

        JobApplication application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application Not Found"));

        application.setCurrentStage(
                ApplicationStage.valueOf(stage.toUpperCase()));

        applicationRepository.save(application);
    }

    @Override
    public void finalizeHiring(Long applicationId) {

        JobApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application Not Found"));

        application.setCurrentStage(ApplicationStage.HIRED);

        applicationRepository.save(application);
    }

    @Override
    public void deleteApplication(Long id) {

        applicationRepository.deleteById(id);
    }
}