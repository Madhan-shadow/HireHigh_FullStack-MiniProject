# HireHigh – Talent Acquisition Management System

HireHigh is a full-stack recruitment management application developed to make the hiring process easier to manage in one place.

The system allows candidates to apply for jobs and helps recruiters and hiring teams manage jobs, applications, and recruitment stages based on their roles.

## Features

* User registration and login
* Role-based access
* Job posting and management
* Job application management
* Application status tracking
* Candidate management
* Recruitment stage management
* JWT-based authentication
* MySQL database integration

## User Roles

* **Candidate** – View available jobs and apply for suitable positions.
* **Recruiter** – Create jobs and manage applications.
* **Hiring Manager** – Review candidates and manage hiring stages.
* **TA Lead** – Monitor the recruitment process.
* **Admin** – Manage users and overall system activities.

## Technologies Used

**Frontend**

* React.js
* JavaScript
* Redux
* HTML
* CSS

**Backend**

* Java
* Spring Boot
* Spring Data JPA
* REST API
* JWT

**Database**

* MySQL

**Tools**

* VS Code
* MySQL Workbench
* Maven
* Git & GitHub

## Project Structure

```text
HireHigh/
├── frontend/
└── backend/
```

## How to Run

### Backend

Go to the backend folder:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### Frontend

Go to the frontend folder:

```bash
cd frontend
```

Install the required packages:

```bash
npm install
```

Start the application:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

## Database

The project uses **MySQL** for storing user, job, candidate, and application information.

Before starting the backend, create the required database and configure the MySQL username, password, and database details in the application configuration.

## Recruitment Flow

```text
Job Posting
     ↓
Job Application
     ↓
Application Review
     ↓
Screening
     ↓
Interview
     ↓
Offer
     ↓
Hired / Rejected
```

## Purpose

This project was developed as a full-stack mini project to gain practical experience in frontend development, backend development, database integration, authentication, and building a complete recruitment workflow.

## Developer

**Madhan R**

AI & Data Science
Sri Krishna College of Technology

## Repository

GitHub: **Madhan-shadow/HireHigh_FullStack-MiniProject**
