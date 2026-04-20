package com.gonggoo.gonggoo.auth.oauth.google;

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

import static com.gonggoo.gonggoo.global.response.ErrorCode.GOOGLE_USER_INFO_NOT_FOUND;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleOAuthClient implements OAuthClient {

    private final GoogleProps props;
    private final RestTemplate restTemplate;

    @Override
    public RegistrationProvider getProvider() {
        return RegistrationProvider.GOOGLE;
    }

    @Override
    public OAuthUserInfo fetchUserInfo(String code) {
        String accessToken = requestAccessToken(code);
        GoogleUserInfoResponse raw = requestUserInfo(accessToken);
        return new OAuthUserInfo(
                RegistrationProvider.GOOGLE,
                raw.sub(),
                raw.email(),
                raw.name(),
                raw.picture(),
                null
        );
    }

    private String requestAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", props.client_id());
        body.add("client_secret", props.client_secret());
        body.add("code", code);
        body.add("grant_type", "authorization_code");
        body.add("redirect_uri", props.redirect_uri());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<GoogleTokenResponse> response = restTemplate.postForEntity(
                props.post_uri(),
                request,
                GoogleTokenResponse.class
        );

        return response.getBody().access_token();
    }

    private GoogleUserInfoResponse requestUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<GoogleUserInfoResponse> response = restTemplate.exchange(
                    props.user_info_url(),
                    HttpMethod.GET,
                    request,
                    GoogleUserInfoResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.debug("GoogleUserResponse 에러 body={}", response.getBody());
                throw new NeighborsException(GOOGLE_USER_INFO_NOT_FOUND);
            }
            return response.getBody();
        } catch (RestClientException e) {
            log.debug("유저 정보 조회 중 에러 msg={}", e.getMessage());
            throw new NeighborsException(GOOGLE_USER_INFO_NOT_FOUND);
        }
    }
}
