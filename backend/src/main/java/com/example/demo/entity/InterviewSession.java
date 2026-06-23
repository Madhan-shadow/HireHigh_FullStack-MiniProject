package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;

@Entity
public class InterviewSession {
    
    @Id
    private Long id;

    private ForeignKey application;

    @
    private LocalDateTime scheduledAt;
}
