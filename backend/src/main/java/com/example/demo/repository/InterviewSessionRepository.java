package com.example.demo.repository;

import javax.swing.text.html.parser.Entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewSessionRepository extends JpaRepository<Entity,Long>{
    
}
