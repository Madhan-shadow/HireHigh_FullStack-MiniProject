package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.entity.JobPosting;
import com.example.demo.entity.Role;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.JobPostingRepository;
import com.example.demo.repository.SystemUserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final JobPostingRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (!userRepository.existsByEmail("admin@hirehigh.com")) {

            SystemUser admin = new SystemUser();
            admin.setUsername("admin");
            admin.setFullname("System Admin");
            admin.setEmail("admin@hirehigh.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.TA_LEAD);

            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("recruiter@hirehigh.com")) {

            SystemUser recruiter = new SystemUser();
            recruiter.setUsername("recruiter");
            recruiter.setFullname("Recruiter");
            recruiter.setEmail("recruiter@hirehigh.com");
            recruiter.setPassword(passwordEncoder.encode("recruit123"));
            recruiter.setRole(Role.RECRUITER);

            userRepository.save(recruiter);
        }

        if (!userRepository.existsByEmail("candidate@hirehigh.com")) {

            SystemUser candidate = new SystemUser();
            candidate.setUsername("candidate");
            candidate.setFullname("Candidate");
            candidate.setEmail("candidate@hirehigh.com");
            candidate.setPassword(passwordEncoder.encode("candidate123"));
            candidate.setRole(Role.CANDIDATE);

            userRepository.save(candidate);
        }

        if (jobRepository.count() == 0) {

            JobPosting job1 = new JobPosting();
            job1.setTitle("Java Full Stack Developer");
            job1.setDepartment("Software");
            job1.setDescription("Java + Spring Boot + React");
            job1.setHiringGoal(5);
            job1.setCurrentFills(0);
            job1.setStatus("OPEN");

            jobRepository.save(job1);

            JobPosting job2 = new JobPosting();
            job2.setTitle("AI Engineer");
            job2.setDepartment("AI & DS");
            job2.setDescription("Machine Learning and Python");
            job2.setHiringGoal(3);
            job2.setCurrentFills(0);
            job2.setStatus("OPEN");

            jobRepository.save(job2);
        }
    }
}