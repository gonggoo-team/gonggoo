package com.gonggoo.gonggoo.auth.controller;

import com.gonggoo.gonggoo.auth.dto.LoginRequest;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/v1")
public class AuthController {

    private final AuthService authService;

    @GetMapping("/login")
    public JwtTokenDto login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }
}
