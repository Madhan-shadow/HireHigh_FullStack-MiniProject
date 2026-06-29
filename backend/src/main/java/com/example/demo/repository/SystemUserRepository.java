package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.SystemUser;

@Repository
public interface SystemUserRepository extends JpaRepository<SystemUser,Long> {

    
}