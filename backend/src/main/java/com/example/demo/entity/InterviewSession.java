package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.websocket.Decoder.Text;

@Entity
public class InterviewSession {
    
    @Id
    private Long id;

    private ForeignKey application;

    private LocalDateTime scheduledAt;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer rating;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ForeignKey getApplication() {
        return application;
    }

    public void setApplication(ForeignKey application) {
        this.application = application;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public InterviewSession() {
    }

    public InterviewSession(Long id, ForeignKey application, LocalDateTime scheduledAt, String feedback, Integer rating) {
        this.id = id;
        this.application = application;
        this.scheduledAt = scheduledAt;
        this.feedback = feedback;
        this.rating = rating;
    }



}
