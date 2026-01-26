package com.gonggoo.gonggoo.auth.controller;

import com.gonggoo.gonggoo.auth.dto.LoginRequest;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.AuthService;
import com.gonggoo.gonggoo.global.response.ApiResponse;
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
    public ApiResponse<JwtTokenDto> login(@RequestBody LoginRequest loginRequest) {
        JwtTokenDto token = authService.login(loginRequest);
        return ApiResponse.success("LOGIN_SUCCESS", token);
    }

    @GetMapping("/reissue")
    public ApiResponse<JwtTokenDto> reissueToken(@RequestHeader("RefreshToken") String refreshToken) {
        jwtTokenProvider.verifyToken(refreshToken);
        JwtTokenDto newToken = authService.reissueToken(refreshToken);
        return ApiResponse.success("TOKEN_REISSUED", newToken);

    }
}
