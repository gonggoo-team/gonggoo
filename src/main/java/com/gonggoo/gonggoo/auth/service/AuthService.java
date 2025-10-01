package com.gonggoo.gonggoo.auth.service;

import com.gonggoo.gonggoo.auth.dto.LoginRequest;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtTokenDto login(LoginRequest loginRequest) {
        Member member = memberRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new IllegalStateException("요청한 이메일에 해당하는 회원이 없습니다."));
        if(!passwordEncoder.matches(loginRequest.password(), member.getPassword())) {
            throw new IllegalStateException("비밀번호가 틀렸습니다.");
        }

        var accessToken = jwtTokenProvider.generateToken(String.valueOf(member.getId()), String.valueOf(member.getRole()));
        return JwtTokenDto.builder()
                .grantType(accessToken.getGrantType())
                .accessToken(accessToken.getAccessToken())
                .refreshToken(accessToken.getRefreshToken())
                .build();
    }

    public JwtTokenDto reissueToken(String refreshToken) {
        String memberId = jwtTokenProvider.parseSubject(refreshToken);
        String role = memberRepository.findRoleById(memberId);

        String newAccessToken = jwtTokenProvider.generateAccessToken(memberId, role);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(memberId);

        return JwtTokenDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
