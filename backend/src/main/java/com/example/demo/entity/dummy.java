package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class dummy {
    
    @Id
    private Long id;

    private String username;

    private String password;

    

    
}
