package com.gonggoo.gonggoo.member.controller;

import com.gonggoo.gonggoo.member.dto.request.MemberSignupRequest;
import com.gonggoo.gonggoo.member.dto.response.EmailCheckResponse;
import com.gonggoo.gonggoo.member.dto.response.MemberResponse;
import com.gonggoo.gonggoo.member.dto.response.NicknameCheckResponse;
import com.gonggoo.gonggoo.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/v1")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<MemberResponse> saveMember(@RequestBody MemberSignupRequest request) {
        MemberResponse memberResponse = memberService.saveMember(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(memberResponse);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<EmailCheckResponse> checkEmail(@PathVariable String email) {
        EmailCheckResponse emailCheckResponse = memberService.validateDuplicateEmail(email);
        return ResponseEntity.ok(emailCheckResponse);
    }

    @GetMapping("/check-nickname/{nickname}")
    public ResponseEntity<NicknameCheckResponse> checkNickname(@PathVariable String nickname) {
        NicknameCheckResponse nicknameCheckResponse = memberService.validateDuplicateNickname(nickname);
        return ResponseEntity.ok(nicknameCheckResponse);
    }
}
