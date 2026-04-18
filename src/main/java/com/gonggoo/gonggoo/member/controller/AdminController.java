package com.gonggoo.gonggoo.member.controller;

import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.member.dto.response.MemberInfoResponse;
import com.gonggoo.gonggoo.member.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "관리자 (Admin)", description = "관리자 API 명세")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/v1")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "사용자 목록 조회", description = "회원가입 되어있는 사용자 목록을 조회합니다.")
    @GetMapping("/users")
    public ApiResponse<MemberInfoResponse> getMembers() {
        MemberInfoResponse members = adminService.getAllMembers();
        return ApiResponse.success("MEMBER_LIST_FETCHED", members);
    }
}
