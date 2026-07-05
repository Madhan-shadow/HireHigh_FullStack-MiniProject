package com.example.demo.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SystemUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        SystemUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User Not Found"));

        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().toString())
                )
        );
    }
}