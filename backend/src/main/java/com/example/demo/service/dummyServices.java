package com.example.demo.service;

import java.util.List;
import java.util.Optional;

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
    
    public List<dummy> fetchdetail(){
        return rep.findAll();
    }
    public Optional<dummy> 
}
