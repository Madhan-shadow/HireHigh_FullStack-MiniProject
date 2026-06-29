package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.dummy;
import com.example.demo.repository.dummyRepository;

@Service
public class dummyServices {

    @Autowired
    dummyRepository rep;

    public dummy ct(dummy dmy) {
        return rep.save(dmy);
    }
    
}
