package com.gonggoo.gonggoo.auth.oauth.kakao;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.auth.oauth.OAuthClient;
import com.gonggoo.gonggoo.auth.oauth.OAuthUserInfo;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static com.gonggoo.gonggoo.global.response.ErrorCode.KAKAO_USER_INFO_NOT_FOUND;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoOAuthClient implements OAuthClient {

    private final KakaoProps props;
    private final RestTemplate restTemplate;

    @Override
    public RegistrationProvider getProvider() {
        return RegistrationProvider.KAKAO;
    }

    @Override
    public OAuthUserInfo fetchUserInfo(String code) {
        String accessToken = requestAccessToken(code);
        KakaoUserInfoResponse raw = requestUserInfo(accessToken);
        return new OAuthUserInfo(
                RegistrationProvider.KAKAO,
                String.valueOf(raw.id()),
                raw.getEmail(),
                raw.getNickname(),
                raw.getProfileImage(),
                null
        );
    }

    private String requestAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", props.client_id());
        body.add("redirect_uri", props.redirect_uri());
        body.add("code", code);
        body.add("client_secret", props.client_secret());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<KakaoTokenResponse> response = restTemplate.postForEntity(
                props.post_uri(),
                request,
                KakaoTokenResponse.class
        );

        return response.getBody().access_token();
    }

    private KakaoUserInfoResponse requestUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<KakaoUserInfoResponse> response = restTemplate.exchange(
                    props.user_info_url(),
                    HttpMethod.GET,
                    request,
                    KakaoUserInfoResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new NeighborsException(KAKAO_USER_INFO_NOT_FOUND);
            }
            return response.getBody();
        } catch (RestClientException e) {
            throw new NeighborsException(KAKAO_USER_INFO_NOT_FOUND);
        }
    }
}
