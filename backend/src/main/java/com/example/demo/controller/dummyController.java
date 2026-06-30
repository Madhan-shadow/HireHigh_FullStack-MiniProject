package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public dummy create(@RequestBody @NonNull dummy dmy){
            return ser.ct(dmy);
        
    }

    @GetMapping("/fetch")
    public List<dummy> fetch(){
        return ser.fetchdetail();
    }

    @GetMapping("/fetchById/{id}")
    public Optional<dummy> fetchById(@PathVariable @NonNull Long id ){
        return ser.fetchbyid(id);
    }

    @PutMapping("/update/{id}/{password}")
    public String updatedata(@PathVariable @NonNull Long id,@PathVariable String password){
        Optional<dummy> dy= ser.fetchbyid(id);
        return ser.update(dy,password);

    }

   @DeleteMapping("/delete/{id}")
    public String deletedata(@PathVariable @NonNull Long id){
        Optional<dummy> dy1= ser.fetchbyid(id);
        return ser.delid(dy1,id);
    }
}
