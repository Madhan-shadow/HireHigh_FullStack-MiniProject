package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.websocket.Decoder.Text;

@Entity
public class InterviewSession {
    
    @Id
    private Long id;

    private ForeignKey application;

    @LocalDateTime
    private LocalDateTime scheduledAt;

    @SuppressWarnings("rawtypes")
    private Text feedback;

    private Integer rating;

    
}
