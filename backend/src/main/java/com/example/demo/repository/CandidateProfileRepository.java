package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.CandidateProfile;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {

    // Spring Data JPA derives this automatically by traversing the
    // `user` field on CandidateProfile down to SystemUser's `id`.
    Optional<CandidateProfile> findByUserId(Long userId);

}