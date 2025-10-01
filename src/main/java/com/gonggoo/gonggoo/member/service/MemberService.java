package com.gonggoo.gonggoo.member.service;

import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.dto.request.MemberSignupRequest;
import com.gonggoo.gonggoo.member.dto.response.EmailCheckResponse;
import com.gonggoo.gonggoo.member.dto.response.MemberResponse;
import com.gonggoo.gonggoo.member.dto.response.NicknameCheckResponse;
import com.gonggoo.gonggoo.member.dto.response.PhoneNumberCheckResponse;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberResponse saveMember(MemberSignupRequest request) {
        validateDuplicate(request);
        String hashedPassword = passwordEncoder.encode(request.password());
        GeoLocation geolocation = new GeoLocation(request.location().getLatitude(), request.location().getLongitude());
        Member member = Member.builder()
                .nickname(request.nickname())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .password(hashedPassword)
                .location(geolocation)
                .build();

        Member savedMember = memberRepository.save(member);
        return MemberResponse.from(savedMember);
    }

    public void validateDuplicate(MemberSignupRequest memberSignupRequest) {
        if (validateDuplicateEmail(memberSignupRequest.email()).exists()) {
            throw new IllegalStateException("이미 사용중인 이메일입니다.");
        }

        if (validateDuplicatePhoneNumber(memberSignupRequest.phoneNumber()).exists()) {
            throw new IllegalStateException("이미 등록된 전화번호입니다.");
        }
    }

    public EmailCheckResponse validateDuplicateEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return EmailCheckResponse.of(email, exists);
    }

    public PhoneNumberCheckResponse validateDuplicatePhoneNumber(String phoneNumber) {
        boolean exists = memberRepository.existsByPhoneNumber(phoneNumber);
        return PhoneNumberCheckResponse.of(phoneNumber, exists);
    }


    public NicknameCheckResponse validateDuplicateNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        return NicknameCheckResponse.of(nickname, exists);
    }

    public String findRoleById(String id) {
        return memberRepository.findRoleById(id);
    }
}
