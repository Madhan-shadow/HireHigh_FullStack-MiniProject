package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.SystemUser;


@Repository
public interface SystemUserRepository extends JpaRepository<SystemUser, Long> {

    Optional<SystemUser> findByUsername(String username);

    Optional<SystemUser> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}