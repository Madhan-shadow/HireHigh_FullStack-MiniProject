package com.example.demo.dto;

public class JobPostingDto {

    private String jobTitle;
    private String company;
    private String location;
    private String description;
    private Double salary;

    public JobPostingDto() {
    }

    public JobPostingDto(String jobTitle, String company, String location,
                         String description, Double salary) {

        this.jobTitle = jobTitle;
        this.company = company;
        this.location = location;
        this.description = description;
        this.salary = salary;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

}