package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.entity.dummy;
import com.example.demo.repository.dummyRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@Service
public class dummyServices {

    @Autowired
    dummyRepository rep;

    public dummy ct(@NonNull dummy dmy) {
        return rep.save(dmy);
    }
    
    public List<dummy> fetchdetail(){
        return rep.findAll();
    }
    public Optional<dummy> fetchbyid(@PathVariable @NonNull Long id){
            return rep.findById(id);
    }
    public dummy delall(@RequestBody dummy dmy){
        return rep.delete(dmy);
    }
}
