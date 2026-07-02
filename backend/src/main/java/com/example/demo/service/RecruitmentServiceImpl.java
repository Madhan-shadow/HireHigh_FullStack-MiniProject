package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.CandidateProfile;
import com.example.demo.entity.JobApplication;
import com.example.demo.entity.JobPosting;
import com.example.demo.entity.SystemUser;
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

        return applicationRepository.findByCandidateUserEmail(username);

    }

    @Override
    public JobApplication apply(Long jobId, String username) {

        SystemUser user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        CandidateProfile candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Candidate Not Found"));

        JobPosting job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job Not Found"));

        JobApplication application = new JobApplication();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setApplicationStatus("APPLIED");

        return applicationRepository.save(application);
    }

    @Override
    public void updateStage(Long id, String stage) {

        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application Not Found"));

        application.setApplicationStatus(stage);

        applicationRepository.save(application);
    }

    @Override
    public void finalizeHiring(Long applicationId) {

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application Not Found"));

        application.setApplicationStatus("HIRED");

        applicationRepository.save(application);
    }

    @Override
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}
// package com.example.demo.service;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.example.demo.entity.CandidateProfile;
// import com.example.demo.entity.JobApplication;
// import com.example.demo.entity.JobPosting;
// import com.example.demo.entity.SystemUser;
// import com.example.demo.repository.CandidateProfileRepository;
// import com.example.demo.repository.JobApplicationRepository;
// import com.example.demo.repository.JobPostingRepository;
// import com.example.demo.repository.SystemUserRepository;

// import jakarta.transaction.Transactional;

// @Service
// public class RecruitmentServiceImpl implements RecruitmentService {

//     @Autowired
//     private JobApplicationRepository applicationRepository;

//     @Autowired
//     private JobPostingRepository jobRepository;

//     @Autowired
//     private SystemUserRepository userRepository;

//     @Autowired
//     private CandidateProfileRepository candidateRepository;

//     @Autowired
//     private JobManagementService jobService;

//     @Override
//     public List<JobApplication> getApplicationsByUsername(String username) {

//         return applicationRepository.findByCandidateUserEmail(username);

//     }

//     @Override
//     public JobApplication apply(Long jobId, String username) {

//         SystemUser user = userRepository.findByEmail(username)
//                 .orElseThrow(() -> new RuntimeException("User Not Found"));

//         CandidateProfile candidate = candidateRepository
//                 .findByUser(user)
//                 .orElseThrow(() -> new RuntimeException("Candidate Not Found"));

//         JobPosting job = jobRepository.findById(jobId)
//                 .orElseThrow(() -> new RuntimeException("Job Not Found"));

//         if(applicationRepository.existsByCandidateCandidateIdAndJobJobId(
//                 candidate.getCandidateId(),
//                 jobId)) {

//             throw new RuntimeException("Already Applied");
//         }

//         JobApplication application = new JobApplication();

//         application.setCandidate(candidate);
//         application.setJob(job);
//         application.setApplicationStatus("APPLIED");

//         return applicationRepository.save(application);

//     }

//     @Override
//     public void updateStage(Long id, String stage) {

//         JobApplication application = applicationRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Application Not Found"));

//         application.setApplicationStatus(stage);

//         applicationRepository.save(application);

//     }

//     @Override
//     @Transactional
//     public void finalizeHiring(Long applicationId) {

//         JobApplication application = applicationRepository.findById(applicationId)
//                 .orElseThrow(() -> new RuntimeException("Application Not Found"));

//         application.setApplicationStatus("HIRED");

//         applicationRepository.save(application);

//         jobService.checkAndCloseJob(
//                 application.getJob().getJobId());

//     }

//     @Override
//     public void deleteApplication(Long id) {

//         applicationRepository.deleteById(id);

//     }

// }