package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="JobPosting")
public class JobPosting {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String department;

    private String description;

    private Integer hiringGoal;

    private Integer currentFills;

    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getHiringGoal() {
        return hiringGoal;
    }

    public void setHiringGoal(Integer hiringGoal) {
        this.hiringGoal = hiringGoal;
    }

    public Integer getCurrentFills() {
        return currentFills;
    }

    public void setCurrentFills(Integer currentFills) {
        this.currentFills = currentFills;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public JobPosting() {
    }

    public JobPosting(Long id, String title, String department, String description, Integer hiringGoal,
            Integer currentFills, String status) {
        this.id = id;
        this.title = title;
        this.department = department;
        this.description = description;
        this.hiringGoal = hiringGoal;
        this.currentFills = currentFills;
        this.status = status;
    }

    
}
