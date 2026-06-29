package com.example.demo.repository;

import javax.swing.text.html.parser.Entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.CandidateProfile;

@Repository
public interface CandidateProfileRepository extends  JpaRepository<CandidateProfile, Long>{
    
}
