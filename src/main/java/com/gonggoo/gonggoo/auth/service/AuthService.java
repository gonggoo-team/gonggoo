package com.gonggoo.gonggoo.auth.service;

import static com.gonggoo.gonggoo.global.response.ErrorCode.KAKAO_USER_INFO_NOT_FOUND;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.auth.dto.LoginRequest;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.kakao.KakaoProps;
import com.gonggoo.gonggoo.auth.kakao.KakaoTokenResponse;
import com.gonggoo.gonggoo.auth.kakao.KakaoUserInfoResponse;
import com.gonggoo.gonggoo.common.domain.Role;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.domain.MemberStatus;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final KakaoProps kakaoProps;
    private final RestTemplate restTemplate;

    public JwtTokenDto login(LoginRequest loginRequest) {
        Member member = memberRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new IllegalStateException("요청한 이메일에 해당하는 회원이 없습니다."));
        if(!passwordEncoder.matches(loginRequest.password(), member.getPassword())) {
            throw new IllegalStateException("비밀번호가 틀렸습니다.");
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

    public JwtTokenDto kakaoLogin(String code) {
        String kakaoAccessToken = getKakaoAccessToken(code);
        KakaoUserInfoResponse kakaoUserInfo = getKaKaoUserInfo(kakaoAccessToken);

        Member member = memberRepository.findByEmail(kakaoUserInfo.getEmail())
                .orElseGet(() -> {
                    return memberRepository.save(Member.builder()
                            .email(kakaoUserInfo.getEmail())
                            .nickname(kakaoUserInfo.getNickname())
                            .profileImage(kakaoUserInfo.getProfileImage())
                            .provider(RegistrationProvider.KAKAO)
                            .providerId(String.valueOf(kakaoUserInfo.id()))
                            .password(null)
                            .phoneNumber(null)
                            .role(Role.USER)
                            .status(MemberStatus.ACTIVE)
                            .build());
                });

        JwtTokenDto jwtTokenDto = jwtTokenProvider.generateToken(String.valueOf(member.getId()), member.getRole());
        return jwtTokenDto;
    }

    private String getKakaoAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", kakaoProps.client_id());
        body.add("redirect_uri", kakaoProps.redirect_uri());
        body.add("code", code);
        body.add("client_secret", kakaoProps.client_secret());
        log.debug("client_id : " + kakaoProps.client_id());
        log.debug("redirect_uri : " + kakaoProps.redirect_uri());
        log.debug("client_secret : " + kakaoProps.client_secret());


        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<KakaoTokenResponse> response = restTemplate.postForEntity(
                kakaoProps.post_uri(),
                request,
                KakaoTokenResponse.class
        );

        return response.getBody().access_token();
    }

    private KakaoUserInfoResponse getKaKaoUserInfo(String kakaoAccessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + kakaoAccessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<KakaoUserInfoResponse> response = restTemplate.exchange(
                kakaoProps.user_info_url(),
                    HttpMethod.GET,
                    request,
                    KakaoUserInfoResponse.class
            );

            if(!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.debug("response에서 에러 발생" + response);
                throw new NeighborsException(KAKAO_USER_INFO_NOT_FOUND);
            }
            return response.getBody();
        } catch (RestClientException e) {
            log.debug("에러 발생: " + e.getMessage());
            throw new NeighborsException(KAKAO_USER_INFO_NOT_FOUND);
        }
    }
}
