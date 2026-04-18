package com.gonggoo.gonggoo.auth.controller;

import com.gonggoo.gonggoo.auth.dto.request.LoginRequest;
import com.gonggoo.gonggoo.auth.dto.response.LoginResponse;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.AuthService;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "인증 (Auth)", description = "로그인/로그아웃 관련 API 명세")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/v1")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "개발자용 로그인", description = "accessToken과 refreshToken 확인용입니다.")
    @PostMapping("/login-dev")
    public ApiResponse<JwtTokenDto> loginForDev(@RequestBody LoginRequest loginRequest) {
        JwtTokenDto token = authService.loginForDev(loginRequest);
        return ApiResponse.success("LOGIN_SUCCESS", token);
    }

    @Operation(summary = "로그인", description = "이메일과 비밀번호를 입력하면 로그인됩니다.")
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.login(loginRequest);
        return ApiResponse.success("LOGIN_SUCCESS", loginResponse);
    }

    @Operation(summary = "토큰 재발행", description = "refreshToken을 통해 토큰을 재발행합니다.")
    @GetMapping("/reissue")
    public ApiResponse<JwtTokenDto> reissueToken(@RequestHeader("RefreshToken") String refreshToken) {
        jwtTokenProvider.verifyToken(refreshToken);
        JwtTokenDto newToken = authService.reissueToken(refreshToken);
        return ApiResponse.success("TOKEN_REISSUED", newToken);

    }

    @Operation(summary = "카카오 로그인", description = "프론트에서 code를 넘기면 해당 코드를 통해 토큰 발행")
    @GetMapping("/login/kakao")
    public ApiResponse<JwtTokenDto> kakaoLogin(@RequestParam("code") String code) {
        JwtTokenDto kakaoToken = authService.kakaoLogin(code);
        return ApiResponse.success("LOGIN_SUCCESS", kakaoToken);
    }

    @Operation(summary = "네이버 로그인", description = "프론트에서 code를 넘기면 해당 코드를 통해 토큰 발행")
    @GetMapping("/login/naver")
    public ApiResponse<JwtTokenDto> naverLogin(@RequestParam("code") String code,
                                               @RequestParam("state") String state) {
        JwtTokenDto naverToken = authService.naverLogin(code, state);
        return ApiResponse.success("LOGIN_SUCCESS", naverToken);
    }

    @Operation(summary = "구글 로그인", description = "프론트에서 code를 넘기면 해당 코드를 통해 토큰 발행")
    @GetMapping("/login/google")
    public ApiResponse<JwtTokenDto> googleLogin(@RequestParam("code") String code){
        JwtTokenDto googleToken = authService.googleLogin(code);
        return ApiResponse.success("LOGIN_SUCCESS", googleToken);
    }
}
