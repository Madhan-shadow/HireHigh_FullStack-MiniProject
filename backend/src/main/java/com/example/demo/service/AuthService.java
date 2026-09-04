package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.ChangePasswordDto;
import com.example.demo.dto.RegisterDto;

public interface AuthService {

    void register(RegisterDto dto);

    AuthResponseDto login(AuthRequestDto dto);

    void changePassword(String username, ChangePasswordDto dto);

}