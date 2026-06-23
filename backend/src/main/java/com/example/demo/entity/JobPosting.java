package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class JobPosting {
    
    @Id
    private Long id;

    private String title;

    private String department;

    private String description;

    
}
