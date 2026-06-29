package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.dummy;
import com.example.demo.service.dummyServices;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
public class dummyController {
    
    @Autowired
    dummyServices ser;

    @PostMapping("/create")
    public dummy create(@RequestBody dummy dmy){
            return ser.ct(dmy);
        
    }

    @GetMapping("/fetch")
    public List<dummy> fetch(){
        return ser.fetchdetail();
    }

    @GetMapping("/fetchById")
    public Optional<dummy> fetchById(){
        return ser.fetchbyid();
    }
}
