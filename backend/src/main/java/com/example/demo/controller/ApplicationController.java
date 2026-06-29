// package com.example.demo.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.lang.NonNull;
// import org.springframework.web.bind.annotation.*;

// import com.example.demo.entity.JobApplication;
// import com.example.demo.service.RecruitmentService;

// @RestController
// @RequestMapping("/api")
// public class ApplicationController {

//     @Autowired
//     private RecruitmentService service;

//     @PostMapping("/create")
//     public JobApplication saveApplication(@RequestBody @NonNull JobApplication application) {
//         return service.saveApplication(application);
//     }

//     @GetMapping("fetch")
//     public List<JobApplication> getAllApplications() {
//         return service.getAllApplications();
//     }

//     @GetMapping("/fetchById")
//     public JobApplication getApplicationById(@PathVariable @NonNull Long id) {
//         return service.getApplicationById(id);
//     }
// }