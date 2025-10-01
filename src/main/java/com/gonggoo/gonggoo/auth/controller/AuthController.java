package com.gonggoo.gonggoo.auth.controller;

import com.gonggoo.gonggoo.auth.dto.LoginRequest;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.AuthService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/v1")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public JwtTokenDto login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @GetMapping("/reissue")
    public JwtTokenDto reissueToken(@RequestHeader("RefreshToken") String refreshToken) {
        try {
            jwtTokenProvider.validateToken(refreshToken);
            return authService.reissueToken(refreshToken);
        } catch (IllegalArgumentException e) {
            throw new JwtException(e.getMessage());
        }
    }
}
