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

        // Prevent duplicate seeding
        if (userRepository.count() > 0) {
            return;
        }

        // Admin
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

        // Manager
        User manager = new User();
        manager.setUsername("manager");
        manager.setEmail("manager@example.com");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setRole("MANAGER");
        userRepository.save(manager);

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

        System.out.println("Default users and jobs seeded successfully.");
    }
}