package com.gonggoo.gonggoo.auth.service;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.auth.dto.request.LoginRequest;
import com.gonggoo.gonggoo.auth.dto.response.LoginResponse;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.oauth.OAuthClientRegistry;
import com.gonggoo.gonggoo.auth.oauth.OAuthUserInfo;
import com.gonggoo.gonggoo.global.domain.Role;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.domain.MemberStatus;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.gonggoo.gonggoo.global.response.ErrorCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OAuthClientRegistry oauthClientRegistry;

    public LoginResponse login(LoginRequest loginRequest) {
        Member member = memberRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new NeighborsException(MEMBER_LOGIN_FAILED));
        if (!passwordEncoder.matches(loginRequest.password(), member.getPassword())) {
            throw new NeighborsException(PASSWORD_FAILED);
        }

        return LoginResponse.from(member);
    }

    public JwtTokenDto loginForDev(LoginRequest loginRequest) {
        Member member = memberRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new NeighborsException(MEMBER_NOT_FOUND));
        if (!passwordEncoder.matches(loginRequest.password(), member.getPassword())) {
            throw new NeighborsException(PASSWORD_FAILED);
        }

        var accessToken = jwtTokenProvider.generateToken(String.valueOf(member.getId()), member.getRole());
        return JwtTokenDto.builder()
                .grantType(accessToken.getGrantType())
                .accessToken(accessToken.getAccessToken())
                .refreshToken(accessToken.getRefreshToken())
                .build();
    }

    public JwtTokenDto reissueToken(String refreshToken) {
        String memberId = jwtTokenProvider.parseSubject(refreshToken);
        Role role = memberRepository.findRoleById(Integer.parseInt(memberId));

        String newAccessToken = jwtTokenProvider.generateAccessToken(memberId, role);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(memberId);

        return JwtTokenDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    public JwtTokenDto oauthLogin(RegistrationProvider provider, String code) {
        OAuthUserInfo userInfo = oauthClientRegistry.get(provider).fetchUserInfo(code);

        Member member = memberRepository.findByEmail(userInfo.email())
                .orElseGet(() -> memberRepository.save(Member.builder()
                        .email(userInfo.email())
                        .nickname(userInfo.nickname())
                        .profileImage(userInfo.profileImage())
                        .phoneNumber(userInfo.phoneNumber())
                        .provider(userInfo.provider())
                        .providerId(userInfo.providerId())
                        .password(null)
                        .role(Role.USER)
                        .status(MemberStatus.ACTIVE)
                        .build()));

        return jwtTokenProvider.generateToken(String.valueOf(member.getId()), member.getRole());
    }
}
