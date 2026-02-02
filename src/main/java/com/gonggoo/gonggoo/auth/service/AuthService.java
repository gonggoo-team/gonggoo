package com.gonggoo.gonggoo.auth.service;

import static com.gonggoo.gonggoo.global.response.ErrorCode.GOOGLE_USER_INFO_NOT_FOUND;
import static com.gonggoo.gonggoo.global.response.ErrorCode.KAKAO_USER_INFO_NOT_FOUND;
import static com.gonggoo.gonggoo.global.response.ErrorCode.NAVER_USER_INFO_NOT_FOUND;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.auth.dto.LoginRequest;
import com.gonggoo.gonggoo.auth.google.GoogleProps;
import com.gonggoo.gonggoo.auth.google.GoogleTokenResponse;
import com.gonggoo.gonggoo.auth.google.GoogleUserInfoResponse;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenDto;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.kakao.KakaoProps;
import com.gonggoo.gonggoo.auth.kakao.KakaoTokenResponse;
import com.gonggoo.gonggoo.auth.kakao.KakaoUserInfoResponse;
import com.gonggoo.gonggoo.auth.naver.NaverProps;
import com.gonggoo.gonggoo.auth.naver.NaverTokenResponse;
import com.gonggoo.gonggoo.auth.naver.NaverUserInfoResponse;
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
    private final NaverProps naverProps;
    private final GoogleProps googleProps;
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
                throw new NeighborsException(KAKAO_USER_INFO_NOT_FOUND);
            }
            return response.getBody();
        } catch (RestClientException e) {
            throw new NeighborsException(KAKAO_USER_INFO_NOT_FOUND);
        }
    }

    public JwtTokenDto naverLogin(String code, String state) {
        String naverToken = getNaverAccessToken(code);
        NaverUserInfoResponse userInfo = getNaverUserInfo(naverToken);

        Member member = memberRepository.findByEmail(userInfo.email())
                .orElseGet(() -> {
                    return memberRepository.save(Member.builder()
                            .email(userInfo.email())
                            .nickname(userInfo.nickname())
                            .profileImage(userInfo.profile_image())
                            .provider(RegistrationProvider.NAVER)
                            .providerId(userInfo.id())
                            .phoneNumber(userInfo.mobile())
                            .password(null)
                            .role(Role.USER)
                            .status(MemberStatus.ACTIVE)
                            .build());
                });
        JwtTokenDto jwtTokenDto = jwtTokenProvider.generateToken(String.valueOf(member.getId()), member.getRole());
        return jwtTokenDto;
    }

    private String getNaverAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", naverProps.client_id());
        body.add("client_secret", naverProps.client_secret());
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<NaverTokenResponse> response = restTemplate.postForEntity(
                naverProps.post_uri(),
                request,
                NaverTokenResponse.class
        );

        return response.getBody().access_token();
    }

    private NaverUserInfoResponse getNaverUserInfo(String naverAccessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + naverAccessToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<NaverUserInfoResponse> response = restTemplate.exchange(
                    naverProps.user_info_url(),
                    HttpMethod.GET,
                    request,
                    NaverUserInfoResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new NeighborsException(NAVER_USER_INFO_NOT_FOUND);
            }

            return response.getBody();
        } catch (RestClientException e) {
            throw new NeighborsException(NAVER_USER_INFO_NOT_FOUND);
        }
    }

    public JwtTokenDto googleLogin(String code) {
        String googleToken = getGoogleAccessToken(code);
        GoogleUserInfoResponse userInfo = getGoogleUserInfo(googleToken);

        Member member = memberRepository.findByEmail(userInfo.email())
                .orElseGet(() -> {
                    return memberRepository.save(Member.builder()
                            .email(userInfo.email())
                            .nickname(userInfo.name())
                            .provider(RegistrationProvider.GOOGLE)
                            .providerId(userInfo.sub())
                            .profileImage(userInfo.picture())
                            .phoneNumber(null)
                            .role(Role.USER)
                            .status(MemberStatus.ACTIVE)
                            .build());
                });

        JwtTokenDto jwtTokenDto = jwtTokenProvider.generateToken(String.valueOf(member.getId()), member.getRole());
        return jwtTokenDto;
    }

    private String getGoogleAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", googleProps.client_id());
        body.add("client_secret", googleProps.client_secret());
        body.add("code", code);
        body.add("grant_type", "authorization_code");
        body.add("redirect_uri", googleProps.redirect_uri());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<GoogleTokenResponse> response = restTemplate.postForEntity(
                googleProps.post_uri(),
                request,
                GoogleTokenResponse.class
        );

        return response.getBody().access_token();
    }

    private GoogleUserInfoResponse getGoogleUserInfo(String googleAccessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + googleAccessToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<GoogleUserInfoResponse> response = restTemplate.exchange(
                    googleProps.user_info_url(),
                    HttpMethod.GET,
                    request,
                    GoogleUserInfoResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.debug("GoogleUserResponse 에러", response.getBody());
                throw new NeighborsException(GOOGLE_USER_INFO_NOT_FOUND);
            }

            return response.getBody();
        } catch (RestClientException e) {
            log.debug("유저 정보 조회 중 에러", e.getMessage());
            throw new NeighborsException(GOOGLE_USER_INFO_NOT_FOUND);
        }
    }
}
