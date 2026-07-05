package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Job;
import com.example.demo.entity.User;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // Prevent duplicate data
        if (userRepository.count() > 0) {
            return;
        }

        // Admin User
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        // Recruiter
        User recruiter = new User();
        recruiter.setUsername("recruiter");
        recruiter.setEmail("recruiter@example.com");
        recruiter.setPassword(passwordEncoder.encode("recruiter123"));
        recruiter.setRole("RECRUITER");
        userRepository.save(recruiter);

        // TA Lead
        User taLead = new User();
        taLead.setUsername("talead");
        taLead.setEmail("talead@example.com");
        taLead.setPassword(passwordEncoder.encode("talead123"));
        taLead.setRole("TA_LEAD");
        userRepository.save(taLead);

        // Candidate
        User candidate = new User();
        candidate.setUsername("candidate");
        candidate.setEmail("candidate@example.com");
        candidate.setPassword(passwordEncoder.encode("candidate123"));
        candidate.setRole("CANDIDATE");
        userRepository.save(candidate);

        // Sample Job
        Job job = new Job();
        job.setTitle("Software Engineer");
        job.setDescription("Spring Boot Developer");
        job.setLocation("Chennai");
        job.setHiringGoal(5);
        jobRepository.save(job);

        System.out.println("====================================");
        System.out.println("Default Users Seeded Successfully");
        System.out.println("Admin      : admin / admin123");
        System.out.println("Recruiter  : recruiter / recruiter123");
        System.out.println("TA Lead    : talead / talead123");
        System.out.println("Candidate  : candidate / candidate123");
        System.out.println("Sample Job Created");
        System.out.println("====================================");
    }
}