package com.example.demo.repository;

import javax.swing.text.html.parser.Entity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<Entity, Long>{
    
}
