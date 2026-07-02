package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.CandidateProfile;
import com.example.demo.entity.SystemUser;

@Repository
public interface CandidateProfileRepository extends  JpaRepository<CandidateProfile, Long>{
    Optional<CandidateProfile> findByUser(SystemUser user);
}
