package com.gonggoo.gonggoo.coopost.controller;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.coopost.dto.request.ApplyRequest;
import com.gonggoo.gonggoo.coopost.dto.response.ApplyResponse;
import com.gonggoo.gonggoo.coopost.dto.response.MyApplyResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.coopost.service.ApplyServiceImpl;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/apply/v1")
@RequiredArgsConstructor
public class ApplyController {

    private final ApplyServiceImpl applyService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 공구 참여 신청
     */
    @PostMapping
    public ApiResponse<ApplyResponse> apply(@RequestHeader("Authorization") String authorizationHeader,
                                            @RequestBody ApplyRequest req) {
        int memberId = extractMemberId(authorizationHeader);
        return ApiResponse.success(HttpStatus.CREATED, "성공적으로 신청되었습니다.",
                applyService.apply(memberId, req));
    }

    /**
     * 공구 신청 취소
     */
    @DeleteMapping("/{applyId}")
    public ApiResponse<ApplyResponse> cancel(@RequestHeader("Authorization") String authorizationHeader,
                                             @PathVariable UUID applyId) {
        int memberId = extractMemberId(authorizationHeader);
        return ApiResponse.success(HttpStatus.OK, "신청이 취소되었습니다.",
                applyService.cancel(memberId, applyId));
    }

    /**
     * 내가 신청한 목록 조회
     */
    @GetMapping("/myparticipation")
    public ApiResponse<SliceResponse<MyApplyResponse>> myParticipation(
            @RequestHeader("Authorization") String authorizationHeader,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        int memberId = extractMemberId(authorizationHeader);
        return ApiResponse.success(applyService.getMyApplyList(memberId, pageable));
    }

    // JWT 추출 헬퍼 메서드
    private int extractMemberId(String authorizationHeader) {
        String accessToken = authorizationHeader.split(" ")[1];
        return Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));
    }
}