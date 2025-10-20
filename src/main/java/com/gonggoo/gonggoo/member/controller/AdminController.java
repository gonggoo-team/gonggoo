package com.gonggoo.gonggoo.member.controller;

import com.gonggoo.gonggoo.member.dto.response.MemberInfoResponse;
import com.gonggoo.gonggoo.member.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/v1")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<MemberInfoResponse> getMembers() {
        return ResponseEntity.ok(adminService.getAllMembers());
    }
}
