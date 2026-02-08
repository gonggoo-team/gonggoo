package com.gonggoo.gonggoo.member.controller;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.member.dto.request.LocationUpdateRequest;
import com.gonggoo.gonggoo.member.dto.request.MemberSignupRequest;
import com.gonggoo.gonggoo.member.dto.request.MemberUpdateRequest;
import com.gonggoo.gonggoo.member.dto.response.EmailCheckResponse;
import com.gonggoo.gonggoo.member.dto.response.LocationResponse;
import com.gonggoo.gonggoo.member.dto.response.MemberResponse;
import com.gonggoo.gonggoo.member.dto.response.NicknameCheckResponse;
import com.gonggoo.gonggoo.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "회원 (Member)", description = "회원 관리 API 명세")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/v1")
public class MemberController {

    private final MemberService memberService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "회원가입")
    @PostMapping("/signup")
    public ApiResponse<MemberResponse> saveMember(@RequestBody MemberSignupRequest request) {
        MemberResponse memberResponse = memberService.save(request);
        return ApiResponse.success(HttpStatus.CREATED, "SIGNUP_SUCCESS", memberResponse);
    }

    @Operation(summary = "중복 이메일 체크")
    @GetMapping("/check-email/{email}")
    public ApiResponse<EmailCheckResponse> checkEmail(@PathVariable String email) {
        EmailCheckResponse emailCheckResponse = memberService.validateDuplicateEmail(email);
        return ApiResponse.success("EMAIL_CHECK_OK", emailCheckResponse);
    }

    @Operation(summary = "중복 닉네임 체크")
    @GetMapping("/check-nickname/{nickname}")
    public ApiResponse<NicknameCheckResponse> checkNickname(@PathVariable String nickname) {
        NicknameCheckResponse nicknameCheckResponse = memberService.validateDuplicateNickname(nickname);
        return ApiResponse.success("NICKNAME_CHECK_OK",nicknameCheckResponse);
    }

    @Operation(summary = "정보 수정")
    @PatchMapping("/me")
    public ApiResponse<MemberResponse> updateMember(@RequestBody MemberUpdateRequest memberUpdateRequest,
                                                       @RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.split(" ")[1];
        int memberId = Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));

        MemberResponse memberResponse = memberService.update(memberId, memberUpdateRequest);
        return ApiResponse.success("MEMBER_UPDATED", memberResponse);
    }

    @Operation(summary = "회원 탈퇴")
    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMember(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.split(" ")[1];
        int memberId = Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));

        memberService.delete(memberId);
        return ApiResponse.success(HttpStatus.NO_CONTENT, "MEMBER_DELETED", null);
    }

    @Operation(summary = "위치 정보 받기", description = "사용자의 현재 위치 정보를 서버에 저장합니다.")
    @GetMapping("/location")
    public ApiResponse<LocationResponse> getLocation(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.split(" ")[1];
        int memberId = Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));

        LocationResponse locationResponse = memberService.getLocation(memberId);
        return ApiResponse.success("LOCATION_READ_OK", locationResponse);
    }

    @Operation(summary = "위치 정보 업데이트", description = "위치가 바뀐 사용자의 위치 정보를 업데이트하여 서버에 저장합니다.")
    @PatchMapping("/location")
    public ApiResponse<MemberResponse> updateLocation(@RequestHeader("Authorization") String authorizationHeader,
                                                         @RequestBody LocationUpdateRequest locationUpdateRequest) {
        String accessToken = authorizationHeader.split(" ")[1];
        int memberId = Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));

        MemberResponse memberResponse = memberService.updateLocation(memberId, locationUpdateRequest);
        return ApiResponse.success("LOCATION_UPDATED", memberResponse);
    }
}
