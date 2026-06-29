package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.dummy;
import com.example.demo.service.dummyServices;

@RestController
@RequestMapping("/api")
public class dummyController {
    
    @Autowired
    dummyServices ser;

    @PostMapping("/create")
    public dummy create
}
